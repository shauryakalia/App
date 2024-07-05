import {useRoute} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import ConnectionLayout from '@components/ConnectionLayout';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormOnyxValues} from '@components/Form/types';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as Connections from '@libs/actions/connections/NetSuiteCommands';
import Navigation from '@libs/Navigation/Navigation';
import type {ExpenseRouteParams} from '@pages/workspace/accounting/netsuite/types';
import type {WithPolicyConnectionsProps} from '@pages/workspace/withPolicyConnections';
import withPolicyConnections from '@pages/workspace/withPolicyConnections';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';

function NetSuiteCustomFormIDPage({policy}: WithPolicyConnectionsProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const policyID = policy?.id ?? '-1';
    const route = useRoute();
    const params = route.params as ExpenseRouteParams;
    const isReimbursable = params.expenseType === CONST.NETSUITE_EXPENSE_TYPE.REIMBURSABLE;

    const config = policy?.connections?.netsuite?.options.config;

    const exportDestination =
        (isReimbursable ? config?.reimbursableExpensesExportDestination : config?.nonreimbursableExpensesExportDestination) ?? CONST.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT;
    const customFormIDKey = isReimbursable ? 'reimbursable' : 'nonReimbursable';

    const updateCustomFormID = useCallback(
        (formValues: FormOnyxValues<typeof ONYXKEYS.FORMS.NETSUITE_CUSTOM_FORM_ID_FORM>) => {
            if (config?.customFormIDOptions?.[customFormIDKey]?.[CONST.NETSUITE_MAP_EXPORT_DESTINATION[exportDestination]] !== formValues[params.expenseType]) {
                Connections.updateNetSuiteCustomFormIDOptions(policyID, formValues[params.expenseType], isReimbursable, exportDestination, config?.customFormIDOptions);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID));
        },
        [config?.customFormIDOptions, customFormIDKey, exportDestination, isReimbursable, params.expenseType, policyID],
    );

    return (
        <ConnectionLayout
            displayName={NetSuiteCustomFormIDPage.displayName}
            onBackButtonPress={() => Navigation.goBack(ROUTES.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID))}
            headerTitle={`workspace.netsuite.advancedConfig.${isReimbursable ? 'customFormIDReimbursable' : 'customFormIDNonReimbursable'}`}
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            policyID={policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            contentContainerStyle={styles.pb2}
            titleStyle={styles.ph5}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.NETSUITE}
        >
            <View style={[styles.flexGrow1, styles.ph5]}>
                <FormProvider
                    formID={ONYXKEYS.FORMS.NETSUITE_CUSTOM_FORM_ID_FORM}
                    style={styles.flexGrow1}
                    onSubmit={updateCustomFormID}
                    submitButtonText={translate('common.confirm')}
                    shouldValidateOnBlur
                    shouldValidateOnChange
                >
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={params.expenseType}
                        label={translate(`workspace.netsuite.advancedConfig.${isReimbursable ? 'customFormIDReimbursable' : 'customFormIDNonReimbursable'}`)}
                        aria-label={translate(`workspace.netsuite.advancedConfig.${isReimbursable ? 'customFormIDReimbursable' : 'customFormIDNonReimbursable'}`)}
                        role={CONST.ROLE.PRESENTATION}
                        spellCheck={false}
                        inputMode={CONST.INPUT_MODE.NUMERIC}
                        defaultValue={config?.customFormIDOptions?.[customFormIDKey]?.[CONST.NETSUITE_MAP_EXPORT_DESTINATION[exportDestination]]}
                    />
                </FormProvider>
            </View>
        </ConnectionLayout>
    );
}

NetSuiteCustomFormIDPage.displayName = 'NetSuiteCustomFormIDPage';

export default withPolicyConnections(NetSuiteCustomFormIDPage);
