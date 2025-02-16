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

  function handleClose(
    modal: ModalInterface,
    event: MouseEvent | React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) {
    const nativeEvent = event instanceof MouseEvent ? event : event.nativeEvent;
    nativeEvent.stopPropagation();

    /**
     * Sometimes we open the image manager modal on top of other modals, so to ensure we don't close all of them accidentally we
     * do a check to see if the thing that was clicked on was the image manager and if it was we don't do anything, because
     * the image manager modal is meant to close first.
     *
     */
    if (modal.id !== "image-manager-modal") {
      const path = nativeEvent.composedPath();
      const imageManagerModalElement = document.getElementById(
        "image-manager-modal",
      );
      if (imageManagerModalElement) {
        const isInsideImageManager = path.includes(imageManagerModalElement);
        if (isInsideImageManager) {
          return;
        }
      }
    }

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
            id={modal.id}
            onClose={(event) => handleClose(modal, event)}
            style={{ zIndex: 10000 + index }}
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
  onClose: (
    event: MouseEvent | React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => void;
  children: ReactNode;
  style?: CSSProperties;
  type: ModalType;
  frameless?: boolean;
  extra?: Record<string, any>;
  id: string;
}

/**
 * Basic modal
 * @param onClose
 * @param children
 * @param style
 * @param type
 * @param frameless
 * @param extra
 * @param id
 * @constructor
 */
function Modal({
  onClose,
  children,
  style,
  type,
  frameless = false,
  extra,
  id,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutsideRef(modalRef, onClose);

  return (
    <div
      id={id}
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
              onClick={(e) => onClose(e)}
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
