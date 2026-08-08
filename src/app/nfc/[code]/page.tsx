'use client';

import { useCallback, useEffect, useState } from 'react';
import { Alert, CircularProgress, Container } from '@mui/material';
import { nfcApi, errMsg } from '@/lib/nfc-api';
import NfcAuthGate from './NfcAuthGate';
import NfcManage from './NfcManage';
import NfcPublicView, { type PublicSocialLink } from './NfcPublicView';
import type { NfcOwnProfile } from './types';

interface Meta {
  kind: 'manage' | 'view';
  isActivated?: boolean;
  disabled: boolean;
}

export default function NfcCodePage({ params }: { params: { code: string } }) {
  const code = params.code;
  const storageKey = `nfc_access_${code}`;

  const [mounted, setMounted] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaError, setMetaError] = useState('');
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [accessJwt, setAccessJwt] = useState<string | null>(null);
  const [profile, setProfile] = useState<NfcOwnProfile | null>(null);
  const [publicLinks, setPublicLinks] = useState<PublicSocialLink[] | null>(null);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    (async () => {
      try {
        const metaRes = await nfcApi.get(`/nfc/public/${code}/meta`);
        if (cancelled) return;
        const m: Meta = metaRes.data.data;
        setMeta(m);

        if (m.disabled) return;

        if (m.kind === 'view') {
          const viewRes = await nfcApi.get(`/nfc/public/${code}/view`);
          if (cancelled) return;
          setPublicLinks(viewRes.data.data.socialLinks);
        } else {
          const savedJwt = localStorage.getItem(storageKey);
          if (savedJwt) {
            try {
              const profRes = await nfcApi.get(`/nfc/public/${code}`, {
                headers: { 'X-Nfc-Access': savedJwt },
              });
              if (cancelled) return;
              setAccessJwt(savedJwt);
              setProfile(profRes.data.data);
            } catch {
              localStorage.removeItem(storageKey);
            }
          }
        }
      } catch (err) {
        if (!cancelled) setMetaError(errMsg(err, 'Liên kết không hợp lệ hoặc đã bị xoá'));
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();

    return () => { cancelled = true; };
  }, [code, storageKey]);

  const handleAuthSuccess = useCallback((jwt: string, prof: NfcOwnProfile) => {
    localStorage.setItem(storageKey, jwt);
    setAccessJwt(jwt);
    setProfile(prof);
  }, [storageKey]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(storageKey);
    setAccessJwt(null);
    setProfile(null);
  }, [storageKey]);

  if (!mounted || loadingMeta) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={28} />
      </Container>
    );
  }

  if (metaError || !meta) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {metaError || 'Liên kết không hợp lệ hoặc đã bị xoá'}
        </Alert>
      </Container>
    );
  }

  if (meta.disabled) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          Thẻ NFC này hiện không khả dụng.
        </Alert>
      </Container>
    );
  }

  if (meta.kind === 'view') {
    return <NfcPublicView links={publicLinks ?? []} />;
  }

  if (!accessJwt || !profile) {
    return (
      <NfcAuthGate
        code={code}
        mode={meta.isActivated ? 'login' : 'activate'}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return <NfcManage code={code} profile={profile} accessJwt={accessJwt} onLogout={handleLogout} />;
}
