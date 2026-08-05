import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AppScreen } from '@/components/ui/AppScreen';
import { LoadingState } from '@/components/ui/StateViews';
import { ImportCompleteStep } from '@/features/wardrobe/components/ImportCompleteStep';
import { ImportPreviewStep } from '@/features/wardrobe/components/ImportPreviewStep';
import { ImportUrlInputStep } from '@/features/wardrobe/components/ImportUrlInputStep';
import {
  applySaveResults,
  buildWardrobeInputs,
  createImportPreview,
  summarizeSaveResults,
  type ImportPreviewItem,
} from '@/features/wardrobe/import/importWorkflow';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { importWardrobeUrl, WardrobeImportClientError } from '@/services/wardrobeImportService';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import type { WardrobeImportResponse } from '@/supabase/functions/_shared/wardrobe-import/types';
import { validateImportUrl } from '@/supabase/functions/_shared/wardrobe-import/validate-url';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'ImportWardrobeWebsite'>;
type Step = 'input' | 'preview' | 'complete';

export function ImportWardrobeWebsiteScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const existingItems = useWardrobeStore((state) =>
    state.loadedUserId === user?.id ? state.items : [],
  );
  const refreshWardrobe = useWardrobeStore((state) => state.refresh);
  const addMany = useWardrobeStore((state) => state.addMany);
  const [step, setStep] = useState<Step>('input');
  const [url, setUrl] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [response, setResponse] = useState<WardrobeImportResponse | null>(null);
  const [products, setProducts] = useState<ImportPreviewItem[]>([]);
  const [error, setError] = useState<WardrobeImportClientError | null>(null);
  const [saveSummary, setSaveSummary] = useState<ReturnType<typeof summarizeSaveResults> | null>(
    null,
  );
  const importLock = useRef(false);
  const saveLock = useRef(false);
  const validation = useMemo(() => validateImportUrl(url), [url]);

  useEffect(() => {
    if (user && useWardrobeStore.getState().loadedUserId !== user.id) {
      void refreshWardrobe(user.id);
    }
  }, [refreshWardrobe, user]);

  const resetInput = () => {
    setUrl('');
    setAttempted(false);
    setError(null);
  };

  const closeOrBack = () => {
    if (step === 'preview') {
      setStep('input');
      setError(null);
      setSaveSummary(null);
    } else {
      navigation.goBack();
    }
  };

  const analyze = async () => {
    setAttempted(true);
    if (!validation.ok || importLock.current) return;
    importLock.current = true;
    setIsImporting(true);
    setError(null);
    setSaveSummary(null);
    try {
      const imported = await importWardrobeUrl(validation.url.toString());
      setResponse(imported);
      setProducts(createImportPreview(imported.products, existingItems));
      setStep('preview');
    } catch (caught) {
      setError(
        caught instanceof WardrobeImportClientError
          ? caught
          : new WardrobeImportClientError('IMPORT_FAILED', 'The page could not be imported.'),
      );
    } finally {
      importLock.current = false;
      setIsImporting(false);
    }
  };

  const paste = async () => {
    try {
      setUrl((await Clipboard.getStringAsync()).trim());
      setAttempted(true);
      setError(null);
    } catch {
      setError(
        new WardrobeImportClientError(
          'IMPORT_FAILED',
          'Clipboard access is unavailable. Enter the URL manually.',
        ),
      );
    }
  };

  const saveSelected = async () => {
    if (!user || saveLock.current) return;
    const inputs = buildWardrobeInputs(products);
    if (inputs.length === 0) {
      setError(
        new WardrobeImportClientError('IMPORT_FAILED', 'Select at least one product to add.'),
      );
      return;
    }
    saveLock.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const results = await addMany(user.id, inputs);
      const summary = summarizeSaveResults(results);
      setProducts((current) => applySaveResults(current, results));
      setSaveSummary(summary);
      if (summary.failed === 0) setStep('complete');
      else {
        setError(
          new WardrobeImportClientError(
            'IMPORT_FAILED',
            `${summary.failed} item${summary.failed === 1 ? '' : 's'} could not be saved. Failed items remain selected.`,
          ),
        );
      }
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  };

  if (isImporting) {
    return (
      <AppScreen onBack={closeOrBack} title="Import from website">
        <LoadingState
          message="Reading the retailer page, finding clothing items, and preparing your wardrobe preview."
          title="Analysing the pageâ€¦"
        />
      </AppScreen>
    );
  }

  if (step === 'complete' && saveSummary) {
    return (
      <ImportCompleteStep
        onImportAnother={() => {
          resetInput();
          setProducts([]);
          setResponse(null);
          setSaveSummary(null);
          setStep('input');
        }}
        onReturn={() => navigation.popToTop()}
        summary={saveSummary}
      />
    );
  }

  if (step === 'input') {
    return (
      <ImportUrlInputStep
        attempted={attempted}
        error={error}
        isImporting={isImporting}
        onAnalyze={() => void analyze()}
        onCancel={navigation.goBack}
        onClear={resetInput}
        onManual={() =>
          navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_DETAILS, {
            imageKey: 'placeholder-manual',
          })
        }
        onPaste={() => void paste()}
        onTryAnother={resetInput}
        onUrlChange={(value) => {
          setUrl(value);
          setAttempted(false);
          setError(null);
        }}
        url={url}
        validation={validation}
      />
    );
  }

  if (!response) return null;
  return (
    <ImportPreviewStep
      error={error}
      isSaving={isSaving}
      onBack={closeOrBack}
      onCancel={navigation.goBack}
      onError={setError}
      onSave={() => void saveSelected()}
      products={products}
      response={response}
      saveSummary={saveSummary}
      setProducts={setProducts}
    />
  );
}
