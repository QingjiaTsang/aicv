import { Button } from "@/web/components/shadcn-ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/web/components/shadcn-ui/credenza";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

type UseConfirmProps = {
  title: string;
  message: string;
};

const useConfirm = ({ title, message }: UseConfirmProps) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const { t } = useTranslation();

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (promise && e.key === "Enter") {
        handleConfirm();
      }
    };

    if (promise) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [promise]);

  const ConfirmationDialog = () => (
    <Credenza open={promise !== null} onOpenChange={handleClose}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription className="hidden">
            {message}
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>{message}</CredenzaBody>

        <CredenzaFooter className="flex justify-center gap-6 md:gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirm}>
            {t('common.confirm')}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );

  return [ConfirmationDialog, confirm];
};

export default useConfirm;
