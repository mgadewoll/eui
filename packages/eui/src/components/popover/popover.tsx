/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, {
  KeyboardEvent,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  Ref,
  RefCallback,
  PropsWithChildren,
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import classNames from 'classnames';
import { focusable, type FocusableElement } from 'tabbable';

import { CommonProps, NoArgCallback } from '../common';
import { FocusTarget, EuiFocusTrap, EuiFocusTrapProps } from '../focus_trap';

import {
  keys,
  getTransitionTimings,
  getWaitDuration,
  performOnFrame,
  htmlIdGenerator,
  focusTrapPubSub,
  useLatest,
} from '../../services';
import { setMultipleRefs } from '../../services/hooks/useCombinedRefs';

import { EuiScreenReaderOnly } from '../accessibility';

import { EuiPortal } from '../portal';

import { EuiMutationObserver } from '../observer/mutation_observer';

import {
  findPopoverPosition,
  getElementZIndex,
  EuiPopoverPosition,
} from '../../services/popover';
import {
  createRepositionOnScroll,
  type CreateRepositionOnScrollReturnType,
} from '../../services/popover/reposition_on_scroll';

import { EuiI18n } from '../i18n';
import { EuiOutsideClickDetector } from '../outside_click_detector';
import { EuiPopoverArrow, EuiPopoverArrowPositions } from './popover_arrow';
import { euiPopoverStyles } from './popover.styles';
import { EuiPopoverPanel } from './popover_panel';
import { EuiPopoverPanelProps } from './popover_panel/_popover_panel';
import { EuiPaddingSize } from '../../global_styling';
import { EuiComponentDefaultsContext } from '../provider/component_defaults';

export const popoverAnchorPosition = [
  'upCenter',
  'upLeft',
  'upRight',
  'downCenter',
  'downLeft',
  'downRight',
  'leftCenter',
  'leftUp',
  'leftDown',
  'rightCenter',
  'rightUp',
  'rightDown',
] as const;

export type PopoverAnchorPosition = (typeof popoverAnchorPosition)[number];
type AnchorPosition = 'up' | 'right' | 'down' | 'left';
type PopoverPhase = 'closed' | 'opening' | 'opened' | 'closing';

export interface EuiPopoverProps extends PropsWithChildren, CommonProps {
  /**
   * Alignment of the popover and arrow relative to the button
   * @default downLeft
   */
  anchorPosition?: PopoverAnchorPosition;
  /**
   * Style and position alteration for arrow-less attachment.
   * Intended for use with inputs as anchors, e.g. EuiInputPopover
   */
  attachToAnchor?: boolean;
  /**
   * Triggering element for which to align the popover to
   */
  button: NonNullable<ReactNode>;
  /**
   * Callback to handle hiding of the popover
   */
  closePopover: NoArgCallback<void>;
  /**
   * Restrict the popover's position within this element
   */
  container?: HTMLElement;
  /**
   * CSS display type for both the popover and anchor
   */
  display?: CSSProperties['display'];
  /**
   * Object of props passed to EuiFocusTrap
   */
  focusTrapProps?: Partial<EuiFocusTrapProps>;
  /**
   * Show arrow indicating to originating button
   * @default false
   */
  hasArrow?: boolean;
  /**
   * Specifies what element should initially have focus; Can be a DOM
   * node, or a selector string (which will be passed to
   * document.querySelector() to find the DOM node), or a function that
   * returns a DOM node.
   *
   * If not passed, initial focus defaults to the popover panel.
   */
  initialFocus?: FocusTarget;
  /**
   * Passed directly to EuiPortal for DOM positioning. Both properties are
   * required if prop is specified
   */
  insert?: {
    sibling: HTMLElement;
    position: 'before' | 'after';
  };
  /**
   * Visibility state of the popover
   */
  isOpen?: boolean;
  /**
   * Traps tab focus within the popover contents
   */
  ownFocus?: boolean;
  /**
   * Custom class added to the EuiPanel containing the popover contents
   */
  panelClassName?: string;
  /**
   * EuiPanel padding on all sides
   */
  panelPaddingSize?: EuiPaddingSize;
  /**
   * Standard DOM `style` attribute. Passed to the EuiPanel
   */
  panelStyle?: CSSProperties;
  /**
   * Object of props passed to EuiPanel. See {@link EuiPopoverPanelProps}
   */
  panelProps?: Omit<
    EuiPopoverPanelProps,
    'style' | 'hasShadow' | 'hasBorder' | 'color'
  >;
  panelRef?: RefCallback<HTMLElement | null>;
  /**
   * Optional screen reader instructions to announce upon popover open,
   * in addition to EUI's default popover instructions for Escape on close.
   * Useful for popovers that may have additional keyboard capabilities such as
   * arrow navigation.
   */
  popoverScreenReaderText?: string | ReactNode;
  popoverRef?: Ref<HTMLDivElement>;
  /**
   * When `true`, the popover's position is re-calculated when the user
   * scrolls, this supports having fixed-position popover anchors. When nesting
   * an `EuiPopover` in a scrollable container, `repositionOnScroll` should be `true`
   */
  repositionOnScroll?: boolean;
  /**
   * By default, popovers will attempt to position themselves along the initial
   * axis specified. If there is not enough room either vertically or horizontally
   * however, the popover will attempt to reposition itself along the secondary
   * cross axis if there is room there instead.
   *
   * If you do not want this repositioning to occur (and it is acceptable for
   * the popover to appear offscreen), set this to false to disable this behavior.
   *
   * @default true
   */
  repositionToCrossAxis?: boolean;
  /**
   * By default, popover content inherits the z-index of the anchor
   * component; pass `zIndex` to override
   */
  zIndex?: number;
  /**
   * Distance away from the anchor that the popover will render
   * @default 4 (0 when `hasArrow=true`)
   */
  offset?: number;
  /**
   * Minimum distance between the popover and the bounding container;
   * Pass an array of 4 values to adjust each side differently: `[top, right, bottom, left]`
   * @default 16
   */
  buffer?: number | [number, number, number, number];
  /**
   * Element to pass as the child element of the arrow;
   * Use case is typically limited to an accompanying `EuiBeacon`
   */
  arrowChildren?: ReactNode;
  /**
   * Provide a name to the popover panel
   */
  'aria-label'?: string;
  /**
   * Alternative option to `aria-label` that takes an `id`.
   * Usually takes the `id` of the popover title
   */
  'aria-labelledby'?: string;
  /**
   * Function callback for when the popover positon changes
   */
  onPositionChange?: (position: EuiPopoverPosition) => void;
}

const anchorPositionToPopoverPositionMap: {
  [position in AnchorPosition]: EuiPopoverPosition;
} = {
  up: 'top',
  right: 'right',
  down: 'bottom',
  left: 'left',
};

export function getPopoverPositionFromAnchorPosition(
  anchorPosition: PopoverAnchorPosition
) {
  // maps the anchor position to the matching popover position
  // e.g. "upLeft" -> "top", "downRight" -> "bottom"

  // extract the first positional word from anchorPosition:
  // starts at the beginning (" ^ ") of anchorPosition and
  // captures all of the characters (" (.*?) ") until the
  // first capital letter (" [A-Z] ") is encountered
  const [, primaryPosition] = anchorPosition.match(/^(.*?)[A-Z]/)!;
  return anchorPositionToPopoverPositionMap[primaryPosition as AnchorPosition];
}

export function getPopoverAlignFromAnchorPosition(
  anchorPosition: PopoverAnchorPosition
) {
  // maps the gravity to the matching popover position
  // e.g. "upLeft" -> "left", "rightDown" -> "bottom"

  // extract the second positional word from anchorPosition:
  // starts a capture group at the first capital letter
  // and includes everything after it
  const [, align] = anchorPosition.match(/([A-Z].*)/)!;

  // this performs two tasks:
  // 1. normalizes the align position by lowercasing it
  // 2. `center` doesn't exist in the lookup map which converts it to `undefined` meaning no align
  return anchorPositionToPopoverPositionMap[
    align.toLowerCase() as AnchorPosition
  ];
}

const DEFAULT_POPOVER_STYLES = {
  top: 50,
  left: 50,
};

const returnFocusConfig = { preventScroll: true };
const closingTransitionTime = 250; // TODO: DRY out var when converting to CSS-in-JS

export type Props = EuiPopoverProps & HTMLAttributes<HTMLDivElement>;

/**
 * Imperative handle exposed via `ref` on EuiPopover.
 * Used by EuiInputPopover to imperatively trigger repositioning.
 */
export interface EuiPopoverRef {
  positionPopoverFixed: () => void;
  positionPopoverFluid: () => void;
}

export const EuiPopover = forwardRef<EuiPopoverRef, Props>((props, ref) => {
  const {
    button,
    anchorPosition = 'downLeft',
    insert,
    isOpen = false,
    ownFocus = true,
    children,
    className,
    closePopover: _closePopover,
    panelClassName,
    panelPaddingSize = 'm',
    panelProps,
    panelRef: _panelRef,
    panelStyle,
    popoverScreenReaderText,
    popoverRef,
    hasArrow = false,
    arrowChildren,
    repositionOnScroll: _repositionOnScroll,
    repositionToCrossAxis = true,
    zIndex: _zIndexProp,
    attachToAnchor,
    display = 'inline-block',
    offset: _offset,
    onPositionChange,
    buffer,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-live': ariaLiveProp,
    container,
    focusTrapProps,
    initialFocus: initialFocusProp,
    tabIndex: _tabIndexProp,
    ...rest
  } = props;
  const [panelId, descriptionId] = useMemo(() => {
    const idGenerator = htmlIdGenerator('euiPopover');
    return [idGenerator('panelId'), idGenerator('descriptionId')];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useContext(EuiComponentDefaultsContext);

  const buttonRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const repositionTimeout = useRef<number | undefined>(undefined);
  const strandedFocusTimeout = useRef<number | undefined>(undefined);
  const openingTransitionTimeout = useRef<number | undefined>(undefined);
  const closingTransitionTimeout = useRef<number | undefined>(undefined);
  const closingTransitionAnimationFrame = useRef<number | undefined>(undefined);

  const openPositionRef = useRef<any>(null);
  const onPositionChangeRef = useLatest(onPositionChange);

  // This uses both state and ref to have a render trigger as well as a reference only value that doesn't trigger re-renders.
  // Both are kept in sync by using a combined setter.
  const [phase, _setPhase] = useState<PopoverPhase>(() =>
    isOpen ? 'opening' : 'closed'
  );
  const phaseRef = useRef<PopoverPhase>(phase);
  const setPhase = useCallback((next: PopoverPhase) => {
    phaseRef.current = next;
    _setPhase(next);
  }, []);

  const [suppressingPopover, setSuppressingPopover] = useState(() => isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  // getDerivedStateFromProps equivalent: Run required state updates immediately on isOpen state change
  // to ensure states are correct. useEffect would run after a render which results in wrong states.
  // This only runs once per isOpen change.
  // see https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (prevIsOpen && !isOpen) {
      setPhase('closing');
    }
  }

  const [arrowPosition, setArrowPosition] =
    useState<EuiPopoverArrowPositions | null>(null);
  const [popoverStyles, setPopoverStyles] = useState<CSSProperties | undefined>(
    {}
  );
  const [arrowStyles, setArrowStyles] = useState<CSSProperties | undefined>({});

  const isOpeningOrOpened = phase === 'opening' || phase === 'opened';
  const showArrow = hasArrow && !attachToAnchor;
  const tabIndexProp = panelProps?.tabIndex ?? _tabIndexProp;

  /* Styles */

  const styles = euiPopoverStyles();
  const popoverCssStyles = [styles.euiPopover, { display, label: display }];
  const classes = classNames(
    'euiPopover',
    {
      'euiPopover-isOpen': isOpeningOrOpened,
    },
    className
  );

  /* Behavior */

  const positionPopover = useCallback(
    (allowEnforcePosition: boolean) => {
      if (buttonRef.current == null || panelRef.current == null) return;

      const offset = _offset != null ? _offset : hasArrow ? 0 : 4;

      let position = getPopoverPositionFromAnchorPosition(anchorPosition);
      let forcePosition = undefined;
      if (
        allowEnforcePosition &&
        // uses refs to prevent unnecessary re-renders
        phaseRef.current === 'opened' &&
        openPositionRef.current != null
      ) {
        position = openPositionRef.current;
        forcePosition = true;
      }

      const {
        top,
        left,
        position: foundPosition,
        arrow,
      } = findPopoverPosition({
        container: container,
        position,
        forcePosition,
        align: getPopoverAlignFromAnchorPosition(anchorPosition),
        anchor: buttonRef.current,
        popover: panelRef.current,
        offset: attachToAnchor ? offset : hasArrow ? 16 + offset : 8 + offset,
        arrowConfig: hasArrow
          ? { arrowWidth: 16, arrowBuffer: 10 }
          : { arrowWidth: 0, arrowBuffer: 0 },
        returnBoundingBox: attachToAnchor,
        allowCrossAxis: repositionToCrossAxis,
        buffer: buffer,
      });

      // the popover's z-index must inherit from the button
      // this keeps a button's popover under a flyout that would cover the button
      // but a popover triggered inside a flyout will appear over that flyout
      const zIndex =
        _zIndexProp == null
          ? getElementZIndex(buttonRef.current, panelRef.current) + 2000
          : _zIndexProp;

      const popoverStyles = {
        ...panelStyle,
        top,
        left,
        zIndex,
      };

      const willRenderArrow = !attachToAnchor && hasArrow;
      const arrowStyles = willRenderArrow ? arrow : undefined;
      const arrowPosition: EuiPopoverPosition = foundPosition;

      onPositionChangeRef.current?.(arrowPosition);

      setPopoverStyles(popoverStyles);
      setArrowStyles(arrowStyles);
      setArrowPosition(arrowPosition);
      openPositionRef.current = foundPosition;
    },
    [
      anchorPosition,
      attachToAnchor,
      buffer,
      container,
      hasArrow,
      _offset,
      onPositionChangeRef,
      panelStyle,
      repositionToCrossAxis,
      _zIndexProp,
    ]
  );

  const positionPopoverFixed = useCallback(() => {
    positionPopover(true);
  }, [positionPopover]);

  const positionPopoverFluid = useCallback(() => {
    positionPopover(false);
  }, [positionPopover]);

  // Expose imperative methods for consumers using a ref (e.g. EuiInputPopover)
  useImperativeHandle(
    ref,
    () => ({
      positionPopoverFixed,
      positionPopoverFluid,
    }),
    [positionPopoverFixed, positionPopoverFluid]
  );

  const setPanelRef = useCallback(
    (node: HTMLElement | null) => {
      panelRef.current = node;
      _panelRef && _panelRef(node);

      if (node == null) {
        // panel has unmounted, restore the state defaults
        setPopoverStyles(DEFAULT_POPOVER_STYLES);
        setArrowStyles({});
        setArrowPosition(null);
        openPositionRef.current = null;

        window.removeEventListener('resize', positionPopoverFluid);
      } else {
        // panel is coming into existence
        positionPopoverFluid();
        window.addEventListener('resize', positionPopoverFluid);
      }
    },
    [_panelRef, positionPopoverFluid]
  );

  const setPopoverRef = useCallback(
    (node: HTMLDivElement | null) => {
      buttonRef.current = node;
      setMultipleRefs([popoverRef], node);
    },
    [popoverRef]
  );

  const getFocusableToggleButton = useCallback(() => {
    if (buttonRef.current) {
      try {
        const focusableItems = focusable(buttonRef.current);
        if (focusableItems.length) {
          return focusableItems[0];
        }
      } catch {
        // tabbable's focusable() can throw in environments that don't
        // fully support CSS selector parsing (e.g. jsdom with :has())
      }
    }
  }, []);

  const handleStrandedFocus = useCallback(() => {
    strandedFocusTimeout.current = window.setTimeout(() => {
      // If `returnFocus` failed and focus was stranded,
      // attempt to manually restore focus to the toggle button.
      // The stranded focus is either in most cases on body but
      // it will be on the panel instead on mount when isOpen=true
      if (
        document.activeElement === document.body ||
        panelRef.current?.contains(document.activeElement) // if focus is on OR within the panel
      ) {
        const toggleButton = getFocusableToggleButton();

        if (toggleButton) {
          toggleButton.focus(returnFocusConfig);
        }
      }
    });
  }, [getFocusableToggleButton]);

  const closePopover = useCallback(() => {
    if (isOpen) {
      _closePopover?.();
    }
  }, [isOpen, _closePopover]);

  const onEscapeKey = useCallback(
    (event: Event) => {
      if (isOpen) {
        event.preventDefault();
        event.stopPropagation();
        closePopover();
        handleStrandedFocus();
      }
    },
    [isOpen, closePopover, handleStrandedFocus]
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === keys.ESCAPE) {
        onEscapeKey(event as unknown as Event);
      }
    },
    [onEscapeKey]
  );

  const onClickOutside = useCallback(
    (event: Event) => {
      // only close the popover if the event source isn't the anchor button
      // otherwise, it is up to the anchor to toggle the popover's open status
      if (
        buttonRef.current &&
        buttonRef.current.contains(event.target as Node) === false
      ) {
        closePopover();
      }
    },
    [closePopover]
  );

  const onOpenPopover = useCallback(() => {
    clearTimeout(strandedFocusTimeout.current);
    clearTimeout(closingTransitionTimeout.current);
    clearTimeout(repositionTimeout.current);

    if (closingTransitionAnimationFrame.current) {
      cancelAnimationFrame(closingTransitionAnimationFrame.current);
    }

    openingTransitionTimeout.current = window.setTimeout(() => {
      setPhase('opening');
    });

    // uses double rAF on purpose to ensure individual paints for closed and opening states
    // otherwise the transition won't be rendered
    // closingTransitionAnimationFrame.current = window.requestAnimationFrame(
    //   () => {
    closingTransitionAnimationFrame.current = window.requestAnimationFrame(
      () => {
        // for each child element of `panel`, find any transition duration we should wait for before stabilizing
        const { durationMatch, delayMatch } = Array.prototype.slice
          .call(
            panelRef.current
              ? [panelRef.current, ...Array.from(panelRef.current.children)]
              : []
          )
          .reduce(
            ({ durationMatch, delayMatch }, element) => {
              const transitionTimings = getTransitionTimings(element);

              return {
                durationMatch: Math.max(
                  durationMatch,
                  transitionTimings.durationMatch
                ),
                delayMatch: Math.max(delayMatch, transitionTimings.delayMatch),
              };
            },
            { durationMatch: 0, delayMatch: 0 }
          );

        repositionTimeout.current = window.setTimeout(() => {
          setPhase('opened');
          positionPopoverFixed();
          focusTrapPubSub.publish();
        }, durationMatch + delayMatch);
      }
    );
    //   }
    // );
  }, [positionPopoverFixed, setPhase]);

  /**
   * Updates ARIA attributes on the popover trigger button
   * Only applies ARIA when the trigger is button-like (semantic <button> or role="button").
   * Avoids adding incorrect ARIA on inputs or other non-button elements.
   */
  const updateTriggerButtonAriaAttributes = useCallback(
    (toggleButton: FocusableElement | undefined, isOpen: boolean) => {
      if (!toggleButton) return;

      const tag = toggleButton.tagName?.toLowerCase();
      const role = toggleButton.getAttribute('role')?.toLowerCase();
      const isButtonLike = tag === 'button' || role === 'button';
      if (!isButtonLike) return;

      toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        toggleButton.setAttribute('aria-controls', panelId);
      } else {
        toggleButton.removeAttribute('aria-controls');
      }
    },
    [panelId]
  );

  const onMutation = useCallback(
    (records: MutationRecord[]) => {
      const waitDuration = getWaitDuration(records);
      positionPopoverFixed();

      performOnFrame(waitDuration, positionPopoverFixed);
    },
    [positionPopoverFixed]
  );

  const repositionOnScroll: CreateRepositionOnScrollReturnType = useMemo(
    () =>
      createRepositionOnScroll(() => ({
        repositionOnScroll: _repositionOnScroll,
        componentDefaults: context.EuiPopover,
        repositionFn: positionPopoverFixed,
      })),
    [context, _repositionOnScroll, positionPopoverFixed]
  );

  /* Effects */

  useEffect(() => {
    console.log('PHASE:', phase);
  }, [phase]);

  useEffect(() => {
    if (suppressingPopover) {
      // component was created with isOpen=true; now that it's mounted
      // stop suppressing and start opening
      setSuppressingPopover(false);
      onOpenPopover();
    }

    updateTriggerButtonAriaAttributes(
      getFocusableToggleButton(),
      props.isOpen ?? false
    );

    return () => {
      clearTimeout(repositionTimeout.current);
      clearTimeout(strandedFocusTimeout.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- false positive; we do want to clear the updated value
      clearTimeout(openingTransitionTimeout.current);
      clearTimeout(closingTransitionTimeout.current);
      cancelAnimationFrame(closingTransitionAnimationFrame.current!);
      focusTrapPubSub.publish();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    repositionOnScroll.update();
  });

  useEffect(() => {
    repositionOnScroll.subscribe();
    return () => repositionOnScroll.cleanup();
  }, [repositionOnScroll]);

  useEffect(() => {
    if (!isOpen) {
      if (phaseRef.current === 'closed') return;

      setPhase('closing');

      if (openingTransitionTimeout.current) {
        // cancel any existing "opening" state and positioning changes
        clearTimeout(openingTransitionTimeout.current);
      }

      if (repositionTimeout.current) {
        // cancel any existing "opened" state and positioning changes
        clearTimeout(repositionTimeout.current);
      }

      closingTransitionTimeout.current = window.setTimeout(() => {
        setPhase('closed');
        focusTrapPubSub.publish();
      }, closingTransitionTime);
    } else {
      onOpenPopover();
    }
  }, [isOpen, onOpenPopover, setPhase]);

  useEffect(() => {
    if (isOpen) {
      positionPopoverFluid();
    }
  }, [
    isOpen,
    anchorPosition,
    buffer,
    _offset,
    panelPaddingSize,
    positionPopoverFluid,
  ]);

  useEffect(() => {
    // Update ARIA attributes on the toggle when open state changes
    updateTriggerButtonAriaAttributes(
      getFocusableToggleButton(),
      isOpen ?? false
    );
  }, [isOpen, getFocusableToggleButton, updateTriggerButtonAriaAttributes]);

  let panel;

  // if (!suppressingPopover && (isOpen || isClosing)) {
  if ((!suppressingPopover || prevIsOpen) && (isOpen || phase !== 'closed')) {
    let tabIndex = tabIndexProp;
    let initialFocus = initialFocusProp;
    let ariaDescribedby;
    let ariaLive: HTMLAttributes<any>['aria-live'];

    const panelAriaModal = panelProps?.hasOwnProperty('aria-modal')
      ? panelProps['aria-modal']
      : 'true';
    const panelRole = panelProps?.hasOwnProperty('role')
      ? panelProps.role
      : 'dialog';

    if (ownFocus || panelAriaModal !== 'true') {
      tabIndex = tabIndexProp ?? 0;
      ariaLive = 'off';
      if (!initialFocus) {
        initialFocus = () => panelRef.current!;
      }
    } else {
      ariaLive = ariaLiveProp ?? 'assertive';
    }

    let focusTrapScreenReaderText;
    if (ownFocus || popoverScreenReaderText) {
      ariaDescribedby = descriptionId;

      focusTrapScreenReaderText = (
        <EuiScreenReaderOnly>
          <p id={descriptionId}>
            {ownFocus && (
              <EuiI18n
                token="euiPopover.screenReaderAnnouncement"
                default="You are in a dialog. Press Escape, or tap/click outside the dialog to close."
              />
            )}
            {popoverScreenReaderText}
          </p>
        </EuiScreenReaderOnly>
      );
    }

    const returnFocus = phase === 'opened' ? returnFocusConfig : false;

    panel = (
      <EuiPortal {...(insert && { insert })}>
        <EuiFocusTrap
          clickOutsideDisables={true}
          onClickOutside={onClickOutside}
          returnFocus={returnFocus} // Ignore temporary state of indecisive focus
          initialFocus={initialFocus}
          onEscapeKey={onEscapeKey}
          disabled={!ownFocus || phase !== 'opened'}
          {...focusTrapProps}
        >
          <EuiPopoverPanel
            id={panelId}
            {...(panelProps as EuiPopoverPanelProps)}
            panelRef={setPanelRef}
            isOpen={isOpeningOrOpened}
            position={arrowPosition}
            isAttached={attachToAnchor}
            className={classNames(panelClassName, panelProps?.className)}
            hasShadow={false}
            paddingSize={panelPaddingSize}
            tabIndex={tabIndex}
            aria-live={ariaLive}
            role={panelRole}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-modal={panelAriaModal}
            aria-describedby={ariaDescribedby}
            style={{
              ...popoverStyles,
              // Adding `will-change` to reduce risk of a blurry animation in Chrome 86+
              willChange: phase !== 'opened' ? 'transform, opacity' : undefined,
            }}
          >
            {showArrow && arrowPosition && (
              <EuiPopoverArrow position={arrowPosition} style={arrowStyles}>
                {arrowChildren}
              </EuiPopoverArrow>
            )}
            {focusTrapScreenReaderText}
            <EuiMutationObserver
              observerOptions={{
                attributes: true, // element attribute changes
                childList: true, // added/removed elements
                characterData: true, // text changes
                subtree: true, // watch all child elements
              }}
              onMutation={onMutation}
            >
              {(mutationRef) => <div ref={mutationRef}>{children}</div>}
            </EuiMutationObserver>
          </EuiPopoverPanel>
        </EuiFocusTrap>
      </EuiPortal>
    );
  }

  // react-focus-on and related do not register outside click detection
  // when disabled, so we still need to conditionally check for that ourselves
  if (ownFocus) {
    return (
      <div
        css={popoverCssStyles}
        className={classes}
        ref={setPopoverRef}
        {...rest}
      >
        {button instanceof HTMLElement ? null : button}
        {panel}
      </div>
    );
  } else {
    return (
      <EuiOutsideClickDetector onOutsideClick={closePopover}>
        <div
          css={popoverCssStyles}
          className={classes}
          ref={setPopoverRef}
          onKeyDown={onKeyDown}
          {...rest}
        >
          {button instanceof HTMLElement ? null : button}
          {panel}
        </div>
      </EuiOutsideClickDetector>
    );
  }
});

EuiPopover.displayName = 'EuiPopover';
