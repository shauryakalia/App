import Str from 'expensify-common/lib/str';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import type {OnyxEntry} from 'react-native-onyx/lib/types';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useEnvironment from '@hooks/useEnvironment';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ErrorUtils from '@libs/ErrorUtils';
import * as LoginUtils from '@libs/LoginUtils';
import Navigation from '@libs/Navigation/Navigation';
import * as ValidationUtils from '@libs/ValidationUtils';
import TeachersUnite from '@userActions/TeachersUnite';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type {LoginList} from '@src/types/onyx';

type IntroSchoolPrincipalFormData = {
    firstName: string;
    lastName: string;
    partnerUserID: string;
};

type IntroSchoolPrincipalPageOnyxProps = {
    loginList: OnyxEntry<LoginList>;
};

type IntroSchoolPrincipalPageProps = IntroSchoolPrincipalPageOnyxProps;

function IntroSchoolPrincipalPage(props: IntroSchoolPrincipalPageProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const {isProduction} = useEnvironment();

    /**
     */
    const onSubmit = (values: IntroSchoolPrincipalFormData) => {
        const policyID = isProduction ? CONST.TEACHERS_UNITE.PROD_POLICY_ID : CONST.TEACHERS_UNITE.TEST_POLICY_ID;
        TeachersUnite.addSchoolPrincipal(values.firstName.trim(), values.partnerUserID.trim(), values.lastName.trim(), policyID);
    };

    /**
     * @returns {Object} - An object containing the errors for each inputID
     */
    const validate = useCallback(
        (values: IntroSchoolPrincipalFormData) => {
            const errors = {};

            if (!ValidationUtils.isValidLegalName(values.firstName)) {
                ErrorUtils.addErrorMessage(errors, 'firstName', 'privatePersonalDetails.error.hasInvalidCharacter');
            } else if (values.firstName) {
                ErrorUtils.addErrorMessage(errors, 'firstName', 'bankAccount.error.firstName');
            }
            if (!ValidationUtils.isValidLegalName(values.lastName)) {
                ErrorUtils.addErrorMessage(errors, 'lastName', 'privatePersonalDetails.error.hasInvalidCharacter');
            } else if (values.lastName) {
                ErrorUtils.addErrorMessage(errors, 'lastName', 'bankAccount.error.lastName');
            }
            if (values.partnerUserID) {
                ErrorUtils.addErrorMessage(errors, 'partnerUserID', 'teachersUnitePage.error.enterEmail');
            }
            if (!values.partnerUserID && props.loginList?.[values.partnerUserID.toLowerCase()]) {
                ErrorUtils.addErrorMessage(errors, 'partnerUserID', 'teachersUnitePage.error.tryDifferentEmail');
            }
            if (!values.partnerUserID && !Str.isValidEmail(values.partnerUserID)) {
                ErrorUtils.addErrorMessage(errors, 'partnerUserID', 'teachersUnitePage.error.enterValidEmail');
            }
            if (!values.partnerUserID && LoginUtils.isEmailPublicDomain(values.partnerUserID)) {
                ErrorUtils.addErrorMessage(errors, 'partnerUserID', 'teachersUnitePage.error.tryDifferentEmail');
            }

            return errors;
        },
        [props.loginList],
    );

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            testID={IntroSchoolPrincipalPage.displayName}
        >
            <HeaderWithBackButton
                title={translate('teachersUnitePage.introSchoolPrincipal')}
                onBackButtonPress={() => Navigation.goBack(ROUTES.TEACHERS_UNITE)}
            />
            {/* @ts-expect-error TODO: Remove this once FormProvider (https://github.com/Expensify/App/issues/31972) is migrated to TypeScript. */}
            <FormProvider
                enabledWhenOffline
                style={[styles.flexGrow1, styles.ph5]}
                formID={ONYXKEYS.FORMS.INTRO_SCHOOL_PRINCIPAL_FORM}
                validate={validate}
                onSubmit={onSubmit}
                submitButtonText={translate('common.letsStart')}
            >
                <>
                    <Text style={[styles.mb6]}>{translate('teachersUnitePage.schoolPrincipalVerfiyExpense')}</Text>
                    <View>
                        <InputWrapper
                            // @ts-expect-error TODO: Remove this once InputWrapper (https://github.com/Expensify/App/issues/31972) is migrated to TypeScript.
                            InputComponent={TextInput}
                            inputID="firstName"
                            name="firstName"
                            label={translate('teachersUnitePage.principalFirstName')}
                            accessibilityLabel={translate('teachersUnitePage.principalFirstName')}
                            role={CONST.ROLE.PRESENTATION}
                            maxLength={CONST.DISPLAY_NAME.MAX_LENGTH}
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.mv4}>
                        <InputWrapper
                            // @ts-expect-error TODO: Remove this once InputWrapper (https://github.com/Expensify/App/issues/31972) is migrated to TypeScript.
                            InputComponent={TextInput}
                            inputID="lastName"
                            name="lastName"
                            label={translate('teachersUnitePage.principalLastName')}
                            accessibilityLabel={translate('teachersUnitePage.principalLastName')}
                            role={CONST.ROLE.PRESENTATION}
                            maxLength={CONST.DISPLAY_NAME.MAX_LENGTH}
                            autoCapitalize="words"
                        />
                    </View>
                    <View>
                        <InputWrapper
                            // @ts-expect-error TODO: Remove this once InputWrapper (https://github.com/Expensify/App/issues/31972) is migrated to TypeScript.
                            InputComponent={TextInput}
                            inputID="partnerUserID"
                            name="partnerUserID"
                            label={translate('teachersUnitePage.principalWorkEmail')}
                            accessibilityLabel={translate('teachersUnitePage.principalWorkEmail')}
                            role={CONST.ROLE.PRESENTATION}
                            inputMode={CONST.INPUT_MODE.EMAIL}
                            autoCapitalize="none"
                        />
                    </View>
                </>
            </FormProvider>
        </ScreenWrapper>
    );
}

IntroSchoolPrincipalPage.displayName = 'IntroSchoolPrincipalPage';

export default withOnyx<IntroSchoolPrincipalPageProps, IntroSchoolPrincipalPageOnyxProps>({
    loginList: {key: ONYXKEYS.LOGIN_LIST},
})(IntroSchoolPrincipalPage);
