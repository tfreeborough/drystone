import {
  createContext,
  ReactNode,
  useState,
  MouseEvent,
  useEffect,
} from "react";
import { useLocation } from "wouter";

/**
 * These two are the only things we need to export from this file as everything else is used internally, we only care about
 * accessing and being able to manipulate the state, not the underlying hook.
 */
export const ModalContext = createContext<ReturnType<typeof useModal>>(null!);
export function ModalProvider({ children }: { children: ReactNode }) {
  const modalState = useModal();
  return (
    <ModalContext.Provider value={modalState}>{children}</ModalContext.Provider>
  );
}

export enum ModalType {
  FULL = "full",
  NORMAL = "normal",
  DRAW = "draw",
}

export interface Modal {
  id: string;
  type: ModalType;
  content: ReactNode;
  triggerElement?: HTMLElement | SVGSVGElement;
  onClose?: () => void;
  frameless?: boolean;
  extra?: Record<string, any>;
}

/**
 * You're probably wondering why this isn't in the shared hooks folder? Well thats because this hook is used
 * exclusively by the ModalProvider to so its state can be shared using the ModalContext. You can't
 * use hooks to share state between components because that's not what hooks do, if I was to create
 * a modal in one component, even if I was using it in another I wouldn't get the same
 * updates. This means its kinda pointless sharing the hook because it will end up
 * being mis-used.
 */
function useModal() {
  const [location] = useLocation();
  const [modals, setModals] = useState<Modal[]>([]);

  function addModal(config: {
    id?: string;
    type: ModalType;
    content: ReactNode;
    event?: MouseEvent<HTMLElement | SVGSVGElement>;
    onClose?: () => void;
    frameless?: boolean;
    extra?: Record<string, any>;
  }) {
    console.log("extra", config.extra);
    setModals((prev) => {
      return [
        ...prev,
        {
          id: config.id ?? self.crypto.randomUUID(),
          type: config.type,
          content: config.content,
          triggerElement: config.event ? config.event.currentTarget : undefined,
          onClose: config.onClose,
          frameless: config.frameless ?? false,
          extra: config.extra,
        },
      ];
    });
  }

  function removeModal(id: string) {
    setModals((current) => current.filter((modal) => modal.id !== id));
  }

  function removeAllModals() {
    setModals([]);
  }

  useEffect(() => {
    removeAllModals();
  }, [location]);

  return {
    modals: modals,
    addModal,
    removeModal,
    removeAllModals,
  };
}
