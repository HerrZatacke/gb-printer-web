import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Buttons from '../Buttons';
import useOverlayGlobalKeys from '../../../hooks/useOverlayGlobalKeys';
import useAutoFocus from '../../../hooks/useAutoFocus';
import './index.scss';
import type { State } from '../../store/State';

interface Props {
  height?: number,
  className?: string,
  header?: string,
  children?: React.ReactNode,
  confirm?: () => void,
  deny?: () => void,
  canConfirm?: boolean,
  closeOnOverlayClick?: boolean,
}

function Lightbox(props: Props) {
  const isFullscreen = useSelector((state: State) => (state.isFullscreen));

  const closeOnOverlayClick = typeof props.closeOnOverlayClick !== 'boolean' ? true : props.closeOnOverlayClick;

  useOverlayGlobalKeys({
    confirm: props.confirm,
    canConfirm: props.canConfirm || false,
    deny: props.deny,
  });

  const {
    autofocusRef,
  } = useAutoFocus();

  return (
    <div
      className={
        classNames(`lightbox ${props.className}`, {
          'lightbox--fullscreen': isFullscreen,
        })
      }
    >
      <button
        type="button"
        className={`lightbox__backdrop ${props.className}__backdrop`}
        onClick={closeOnOverlayClick ? props.deny : undefined}
      />
      <div
        className={`lightbox__box ${props.className}__box`}
        ref={autofocusRef as React.MutableRefObject<HTMLDivElement>}
        style={{
          height: props.height ? `${props.height}px` : undefined,
        }}
      >
        <dialog
          className={`lightbox__box-content ${props.className}__box-content`}
          aria-labelledby="lightbox-header"
        >
          {props.header ? (
            <div
              id="lightbox-header"
              className={`lightbox__header ${props.className}__header`}
            >
              {props.header}
            </div>
          ) : null}
          {props.children}
        </dialog>
        {props.confirm || props.deny ? (
          <Buttons
            confirm={props.confirm}
            canConfirm={props.canConfirm}
            deny={props.deny}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Lightbox;
