// Run: npm run test:zalo-reward  (Node >= 22.6 strips the TS types natively)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shouldOpenModal, phaseOf, shouldPoll, isPlausibleVnPhone, makeConfetti, confettiLifetimeMs,
  offerConditions, resultMessage, CONFETTI_COLORS, POLL_MAX_DURATION_MS,
} from '../src/lib/zalo-oa-reward-logic.ts';

const ALL = ['ELIGIBLE', 'AWAITING_ZALO', 'IDENTITY_PENDING', 'FOLLOW_PENDING', 'LINKED', 'REWARD_PROCESSING',
  'REWARD_ASSIGNED', 'ALREADY_CLAIMED', 'NOT_ELIGIBLE', 'UNSUPPORTED_LINKING', 'EXPIRED', 'ERROR'];

test('modal opens only for an eligible / in-progress first-time flow', () => {
  assert.equal(shouldOpenModal({ enabled: true, state: 'ELIGIBLE' }), true);
  assert.equal(shouldOpenModal({ enabled: true, state: 'FOLLOW_PENDING' }), true);
  assert.equal(shouldOpenModal({ enabled: true, state: 'ALREADY_CLAIMED', couponCode: 'X' }), false); // existing UID skips
  assert.equal(shouldOpenModal({ enabled: true, state: 'NOT_ELIGIBLE' }), false);
  assert.equal(shouldOpenModal({ enabled: false, state: 'NOT_ELIGIBLE', reason: 'DISABLED' }), false);
  assert.equal(shouldOpenModal(null), false);
});

test('phase mapping: success only on REWARD_ASSIGNED, never optimistic', () => {
  assert.equal(phaseOf('AWAITING_ZALO', false), 'offer');
  assert.equal(phaseOf('AWAITING_ZALO', true), 'connecting');
  assert.equal(phaseOf('IDENTITY_PENDING', false), 'connecting');
  for (const s of ['FOLLOW_PENDING', 'LINKED', 'REWARD_PROCESSING']) assert.equal(phaseOf(s, true), 'confirming');
  assert.equal(phaseOf('REWARD_ASSIGNED', false), 'success');
  assert.equal(phaseOf('UNSUPPORTED_LINKING', true), 'unsupported');
  const successLike = ALL.filter((s) => phaseOf(s, true) === 'success');
  assert.deepEqual(successLike, ['REWARD_ASSIGNED']);
  // No phase for codes / OTP exists at all.
  for (const s of ALL) assert.ok(!/code|otp/i.test(phaseOf(s, true)));
});

test('polling stops on terminal, expired and eligible-but-unopened states', () => {
  const polled = ALL.filter(shouldPoll);
  assert.deepEqual(polled, ['AWAITING_ZALO', 'IDENTITY_PENDING', 'FOLLOW_PENDING', 'LINKED', 'REWARD_PROCESSING']);
  assert.equal(shouldPoll(undefined), false);
  assert.ok(POLL_MAX_DURATION_MS > 0);
});

test('optional phone: format check only, empty allowed, any valid VN mobile accepted', () => {
  assert.equal(isPlausibleVnPhone(''), true);
  assert.equal(isPlausibleVnPhone('0912345678'), true);
  assert.equal(isPlausibleVnPhone('+84 912 345 678'), true);
  assert.equal(isPlausibleVnPhone('84912345678'), true);
  assert.equal(isPlausibleVnPhone('12345'), false);
  assert.equal(isPlausibleVnPhone('0212345678'), false);
});

test('confetti: deterministic, bounded and with a finite lifetime (cleanup)', () => {
  const a = makeConfetti(70, 42);
  assert.equal(a.length, 70);
  assert.deepEqual(a, makeConfetti(70, 42));
  assert.notDeepEqual(a, makeConfetti(70, 43));
  for (const p of a) {
    assert.ok(p.x >= -50 && p.x <= 50);
    assert.ok(CONFETTI_COLORS.includes(p.color));
  }
  const life = confettiLifetimeMs(a);
  assert.ok(life > 1000 && life < 4000, `lifetime ${life}`);
  assert.equal(makeConfetti(0).length, 0);
});

test('offer conditions come from the DB offer', () => {
  const lines = offerConditions({ discountPercent: 20, minOrderValue: 50000, maxDiscountAmount: 1000000, endDate: '2026-11-17T00:00:00.000Z' });
  assert.match(lines.join('|'), /50\.000đ/);
  assert.match(lines.join('|'), /1\.000\.000đ/);
  assert.match(lines.join('|'), /17\/11\/2026/);
  assert.deepEqual(offerConditions(undefined), []);
});

test('result page messages never claim success for non-success results', () => {
  assert.equal(resultMessage('done').tone, 'ok');
  for (const r of ['denied', 'expired', 'invalid', 'unsupported', 'error', 'whatever', null]) {
    assert.notEqual(resultMessage(r).tone, 'ok');
  }
});
