import {
  cloneElement,
  CSSProperties,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
} from "react";
import {
  Modal as ModalInterface,
  ModalContext,
  ModalType,
} from "../ModalProvider/ModalProvider";
import { createPortal } from "react-dom";
import { useClickOutsideRef } from "../../hooks";
import { DrawSlideFromBottom, FadeIn } from "../../animations";
import css from "./ModalRenderer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * The only thing we need to export in this file, gets the current list of modals from the ModalContext and loops
 * over them to render at the portal location.
 * @constructor
 */
export function ModalRenderer() {
  const { modals, removeModal } = useContext(ModalContext);

  function handleClose(modal: ModalInterface) {
    removeModal(modal.id);
    if (modal.onClose) {
      modal.onClose();
    }
  }

  return (
    <>
      {modals.map((modal, index) => (
        <ModalPortal key={modal.id}>
          <Modal
            onClose={() => handleClose(modal)}
            style={{ zIndex: 1000 + index }}
            type={modal.type}
            frameless={modal.frameless}
            extra={modal.extra}
          >
            {modal.content}
          </Modal>
        </ModalPortal>
      ))}
    </>
  );
}

/**
 * Now you're thinking with portals!
 * @param children
 * @constructor
 */
const ModalPortal = ({ children }: PropsWithChildren) => {
  const portalRoot = document.getElementById("modal-portal");
  if (portalRoot) {
    return createPortal(children, portalRoot);
  }
};

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
  type: ModalType;
  frameless?: boolean;
  extra?: Record<string, any>;
}

/**
 * Basic modal
 * @param onClose
 * @param children
 * @param style
 * @param type
 * @param frameless
 * @param extra
 * @constructor
 */
function Modal({
  onClose,
  children,
  style,
  type,
  frameless = false,
  extra,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutsideRef(modalRef, onClose);

  return (
    <div
      className={`${css.modal} ${css[type]} ${frameless ? css.frameless : css.framed}`}
      style={{
        zIndex: 20,
        ...style,
      }}
    >
      <FadeIn className={css.background} duration={0.2}></FadeIn>
      {type === ModalType.FULL && (
        <div ref={modalRef} className={css.card}>
          <FadeIn duration={0.2}>
            <FontAwesomeIcon
              icon={["fas", "close"]}
              className={css.close}
              onClick={onClose}
            />
            {cloneElement(children as ReactElement, {
              extra,
            })}
          </FadeIn>
        </div>
      )}
      {type === ModalType.NORMAL && (
        <div ref={modalRef} className={css.card}>
          <FadeIn duration={0.2}>
            <FontAwesomeIcon
              icon={["fas", "close"]}
              className={css.close}
              onClick={onClose}
            />
            {cloneElement(children as ReactElement, {
              extra,
            })}
          </FadeIn>
        </div>
      )}
      {type === ModalType.DRAW && (
        <div ref={modalRef} className={css.card}>
          <DrawSlideFromBottom>
            {cloneElement(children as ReactElement, {
              extra,
            })}
          </DrawSlideFromBottom>
        </div>
      )}
    </div>
  );
}
