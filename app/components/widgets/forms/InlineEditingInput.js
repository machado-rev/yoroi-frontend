// @flow
import React, { Component, } from 'react';
import type { Node } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import classnames from 'classnames';
import { Input } from 'react-polymorph/lib/components/Input';
import ReactToolboxMobxForm from '../../../utils/ReactToolboxMobxForm';
import vjf from 'mobx-react-form/lib/validators/VJF';
import styles from './InlineEditingInput.scss';
import config from '../../../config';
import { InputOwnSkin } from '../../../themes/skins/InputOwnSkin';
import type { $npm$ReactIntl$IntlFormat } from 'react-intl';

const messages = defineMessages({
  change: {
    id: 'inline.editing.input.change.label',
    defaultMessage: '!!!change',
  },
  cancel: {
    id: 'inline.editing.input.cancel.label',
    defaultMessage: '!!!cancel',
  },
  changesSaved: {
    id: 'inline.editing.input.changesSaved',
    defaultMessage: '!!!Your changes have been saved',
  }
});

type Props = {|
  +className?: string,
  +isActive: boolean,
  +inputFieldLabel: string,
  +inputFieldValue: string,
  +onStartEditing: void => void,
  +onStopEditing: void => void,
  +onCancelEditing: void => void,
  +onSubmit: string => PossiblyAsync<void>,
  +isValid: string => boolean,
  +validationErrorMessage: string,
  +successfullyUpdated: boolean,
  +classicTheme: boolean,
|};

type State = {|
  isActive: boolean,
|};

@observer
export default class InlineEditingInput extends Component<Props, State> {
  static defaultProps: {|className: void|} = {
    className: undefined
  };

  state: State = {
    isActive: false,
  };

  static contextTypes: {|intl: $npm$ReactIntl$IntlFormat|} = {
    intl: intlShape.isRequired,
  };

  validator: ReactToolboxMobxForm = new ReactToolboxMobxForm({
    fields: {
      inputField: {
        value: this.props.inputFieldValue,
        validators: [({ field }) => (
          [
            this.props.isValid(field.value),
            this.props.validationErrorMessage
          ]
        )],
      }
    }
  }, {
    options: {
      validateOnChange: true,
      validationDebounceWait: config.forms.FORM_VALIDATION_DEBOUNCE_WAIT,
    },
    plugins: {
      vjf: vjf()
    },
  });

  submit: (() => void) = () => {
    this.validator.submit({
      onSuccess: async (form) => {
        const { inputField } = form.values();
        if (inputField !== this.props.inputFieldValue) {
          await this.props.onSubmit(inputField);
          this.props.onStopEditing();
        } else {
          this.props.onCancelEditing();
        }
        this.setState({ isActive: false });
      }
    });
  };

  handleInputKeyDown: ((event: KeyboardEvent) => void) = (event: KeyboardEvent) => {
    if (event.which === 13) { // ENTER key
      this.onBlur();
    }
    if (event.which === 27) { // ESCAPE key
      this.onCancel();
    }
  };

  onFocus: (() => void) = () => {
    this.setState({ isActive: true });
    this.props.onStartEditing();
  };

  onBlur: (() => void) = () => {
    if (this.state.isActive) {
      this.submit();
    }
  };

  onCancel: (() => void) = () => {
    const inputField = this.validator.$('inputField');
    inputField.value = this.props.inputFieldValue;
    this.setState({ isActive: false });
    this.props.onCancelEditing();
  };

  componentDidUpdate(): void {
    if (this.props.isActive && this.inputField) {
      this.inputField.focus();
    }
  }

  inputField: Input;

  render(): Node {
    const { validator } = this;
    const {
      className,
      inputFieldLabel,
      isActive,
      inputFieldValue,
      successfullyUpdated,
    } = this.props;
    const { intl } = this.context;
    const inputField = validator.$('inputField');
    const componentStyles = classnames([
      className,
      styles.component,
      isActive ? null : styles.inactive,
    ]);
    const inputStyles = classnames([
      successfullyUpdated ? 'input_animateSuccess' : null,
      isActive ? null : 'input_cursorPointer'
    ]);

    return (
      <div
        className={componentStyles}
        onBlur={this.onBlur}
        onClick={this.onFocus}
        role="presentation"
        aria-hidden
      >

        <Input
          className={inputStyles}
          themeOverrides={styles}
          type="text"
          label={inputFieldLabel}
          value={isActive ? inputField.value : inputFieldValue}
          onChange={inputField.onChange}
          onFocus={inputField.onFocus}
          onBlur={inputField.onBlur}
          onKeyDown={event => this.handleInputKeyDown(event)}
          error={isActive ? inputField.error : null}
          disabled={!isActive}
          inputRef={(input) => { this.inputField = input; }}
          skin={InputOwnSkin}
        />

        {isActive && (
          <button
            type="button"
            className={classnames([styles.button, inputField.error ? styles.error : ''])}
            onMouseDown={this.onCancel}
          >
            {intl.formatMessage(messages.cancel)}
          </button>
        )}

        {successfullyUpdated && (
          <div className={styles.savingResultLabel}>
            {intl.formatMessage(messages.changesSaved)}
          </div>
        )}

      </div>
    );
  }

}
