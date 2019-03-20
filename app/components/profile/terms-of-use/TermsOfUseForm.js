// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Button } from 'react-polymorph/lib/components/Button';
import { ButtonSkin } from 'react-polymorph/lib/skins/simple/ButtonSkin';
import { defineMessages, intlShape } from 'react-intl';
import { Checkbox } from 'react-polymorph/lib/components/Checkbox';
import { CheckboxSkin } from 'react-polymorph/lib/skins/simple/CheckboxSkin';
import LocalizableError from '../../../i18n/LocalizableError';
import TermsOfUseText from './TermsOfUseText';
import styles from './TermsOfUseForm.scss';

const messages = defineMessages({
  checkboxLabel: {
    id: 'profile.termsOfUse.checkboxLabel',
    defaultMessage: '!!!I agree with terms of use',
    description: 'Label for the "I agree with terms of use" checkbox.'
  },
  submitLabel: {
    id: 'profile.termsOfUse.submitLabel',
    defaultMessage: '!!!Continue',
    description: 'Label for the "Terms of use" form submit button.'
  },
});

type Props = {
  localizedTermsOfUse: string,
  onSubmit: Function,
  isSubmitting: boolean,
  error?: ?LocalizableError,
  classicTheme: boolean
};

type State = {
  areTermsOfUseAccepted: boolean,
};

@observer
export default class TermsOfUseForm extends Component<Props, State> {
  static defaultProps = {
    error: undefined
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    areTermsOfUseAccepted: false,
  };

  toggleAcceptance() {
    this.setState(prevState => ({ areTermsOfUseAccepted: !prevState.areTermsOfUseAccepted }));
  }

  submit = () => {
    this.props.onSubmit();
  };

  render() {
    const { intl } = this.context;
    const { isSubmitting, error, localizedTermsOfUse, classicTheme } = this.props;
    const { areTermsOfUseAccepted } = this.state;

    const centeredBoxClasses = classicTheme ? styles.centeredBoxClassic : styles.centeredBox;
    const checkboxClasses = classicTheme ? styles.checkboxClassic : styles.checkbox;
    const submitButtonClass = classicTheme ? styles.submitButtonClassic : styles.submitButton;
    const submitButtonSpinningClass = classicTheme
      ? styles.submitButtonSpinningClassic
      : styles.submitButtonSpinning;
    const buttonClasses = classnames([
      'primary',
      isSubmitting ? submitButtonSpinningClass : submitButtonClass,
    ]);

    const checkboxLabel = 'checkboxLabel';
    return (
      <div className={styles.component}>
        <div className={centeredBoxClasses}>

          <TermsOfUseText localizedTermsOfUse={localizedTermsOfUse} classicTheme={classicTheme} />

          <div className={checkboxClasses}>
            <Checkbox
              label={intl.formatMessage(messages[checkboxLabel])}
              onChange={this.toggleAcceptance.bind(this)}
              checked={areTermsOfUseAccepted}
              skin={CheckboxSkin}
            />

            <Button
              className={buttonClasses}
              label={intl.formatMessage(messages.submitLabel)}
              onMouseUp={this.submit}
              disabled={!areTermsOfUseAccepted}
              skin={ButtonSkin}
            />
          </div>

          {error && <p className={styles.error}>{intl.formatMessage(error)}</p>}
        </div>
      </div>
    );
  }

}
