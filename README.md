# Money Transfer

## Todo
* [X] Product
****
    Product.schema = new SimpleSchema({
        name: {
            type: String
        },
        status: {
            type: String,
            optional: true,
            defaultValue: "Internal",
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "Internal", value: "Internal"},
                        {label: "External", value: "External"}
                    ];
                }
            }
        },
        telephone: {
            type: String
        },
        registerDate: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY',
                        showTodayButton: true
                    }
                }
            }
        },
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            optional: true
        },
        address: {
            type: String,
            optional:true
        },
        branchId: {
            type: String,
        },
        service: {
            type: [Object],
            minCount: 1
        },
        'service.$.fromAmount': {
            type: Number,
            decimal:true
        },
        'service.$.toAmount': {
            type: Number,
            decimal:true
        },
        'service.$.fee': {
            type: Number,
            decimal:true
        },
        'service.$.expend': {
            type: Number,
            optional: true,
            decimal:true
        },
        'service.$.income': {
            type: Number,
            optional: true,
            decimal:true
        },
    
    });
****
* [X] Customer
****
    Customer.schema = new SimpleSchema({
        name: {
            type: String
        },
        telephone: {
            type: String
        },
        gender: {
            type: String,
            optional:true,
            autoform: {
                type: "select2",
                options: function () {
                    return SelectOpts.gender();
                }
            }
        },
        dob: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY',
                        showTodayButton: true
                    }
                }
            }
        },
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            optional: true
        },
        address: {
            type: String,
            optional:true
        },
        branchId: {
            type: String
        }
    });
****
* [ ] Transfer
****
    Transfer.schema = new SimpleSchema({
        invoice: {
            type: String,
            optional: true,
            label: "Invoice"
        },
        transferDate: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY HH:mm:ss',
                        showTodayButton: true
                    }
                }
            }
        },
        transferType: {
            type: String,
            optional: true,
            defaultValue: "In",
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "Transfer In", value: "In"},
                        {label: "Transfer Out", value: "Out"}
                    ];
                }
            }
        },
        feeType: {
            type: String,
            optional: true,
            defaultValue: "Default",
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "Default Price", value: "Default"},
                        {label: "Custom Price", value: "Custom"}
                    ];
                }
            }
        },
        senderId: {
            type: String,
            label: "Sender",
            autoform: {
                type: 'universe-select',
                afFieldInput: {
                    uniPlaceholder: 'Select One',
                    optionsMethod: 'moneyTransfer.selectOptMethods.customer',
                    optionsMethodParams: function () {
                        if (Meteor.isClient) {
                            let currentBranch = Session.get('currentBranch');
                            return {branchId: currentBranch};
                        }
                    }
                }
            }
        },
        receiverId: {
            type: String,
            label: "Receiver",
            autoform: {
                type: 'universe-select',
                afFieldInput: {
                    uniPlaceholder: 'Select One',
                    optionsMethod: 'moneyTransfer.selectOptMethods.customer',
                    optionsMethodParams: function () {
                        if (Meteor.isClient) {
                            let currentBranch = Session.get('currentBranch');
                            return {branchId: currentBranch};
                        }
                    }
                }
            }
        },
        supplierId: {
            type: String,
            label: "Supplier",
            autoform: {
                type: 'universe-select',
                afFieldInput: {
                    uniPlaceholder: 'Please search... (limit 10)',
                    optionsMethod: 'moneyTransfer.selectOptMethods.supplier'
                }
            }
        },
        code: {
            type: String,
            label: "Account Code"
        },
        amount: {
            type: Number,
            decimal: true,
            label: "Amount"
        },
        amountFee: {
            type: Number,
            decimal: true,
            label: "Amount Fee"
        },
        expend:{
            type:Number,
            decimal:true,
            optional:true
        },
        income:{
           type:Number,
           decimal:true,
           optional:true
        },
        currency: {
            type: String,
            label: "Currency",
            defaultValue: "THB",
            autoform: {
                type: "select2",
                options: function () {
                    return SelectOpts.currency();
                }
            }
        },
        exchanges: {
            type: [Object],
            optional: true
        },
        'exchange.$': {
            type: Object,
            optional: true
        },
        'exchange.$.currency': {
            type: String,
            optional: true
        },
        'exchange.$.fromAmount': {
            type: Number,
            decimal: true,
            min:0,
            optional: true
        },
        'exchange.$.toAmount': {
            type: Number,
            decimal: true,
            optional: true
        },
        remainAmount: {
            type: Number,
            decimal: true,
            optional: true,
            label: "Remain Amount"
        },
        description: {
            type: String,
            optional: true,
            label: "Description"
        },
        status:{
            type: String
        },
    
        branchId: {
            type: String
        }
    });
****
* [X] Exchange
****
    Exchange.schema = new SimpleSchema({
        date: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY',
                        showTodayButton: true
                    }
                }
            }
        },
        //==================
        'baseKhr': {
            type: Object
        },
        'baseKhr.KHR': {
            type: Number,
            defaultValue:1,
            label: "KHR",
            autoform: {
                afFieldInput: {
                    readonly: true
                }
            }
        },
        'baseKhr.USD': {
            type: Number,
            decimal: true,
            label: "USD"
        },
        'baseKhr.THB': {
            type: Number,
            label: "THB"
        },
        //====================
        'baseUsd':{
            type:Object
        },
        'baseUsd.USD': {
            type: Number,
            defaultValue:1,
            decimal:true,
            label:"USD",
            autoform: {
                afFieldInput: {
                    readonly: true
                }
            }
        },
        'baseUsd.KHR': {
            type: Number,
            label:"KHR"
        },
        'baseUsd.THB': {
            type: Number,
            label:"THB"
        },
        // //============
        'baseThb':{
            type:Object
        },
        'baseThb.THB': {
            type: Number,
            defaultValue:1,
            label:"THB",
            autoform: {
                afFieldInput: {
                    readonly: true
                }
            }
        },
        'baseThb.KHR': {
            type: Number,
            label:"KHR"
        },
        'baseThb.USD': {
            type: Number,
            decimal:true,
            label:"USD"
        },
        branchId: {
            type: String
        }
    });
****
* [X] BankAccount
****
    BankAccount.schema = new SimpleSchema({
        inputDate: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY',
                        showTodayButton: true
                    }
                }
            }
        },
        type:{
            type:String
        },
        amount: {
            type: Number,
            label:"KHR"
        },
        agentFee: {
            type: Number,
            decimal:true,
            label:"USD"
        },
        balanceagentFee: {
            type: Number,
            label:"THB"
        },
        balanceAmount: {
            type: Number,
            label:"THB"
        },
        branchId: {
            type: String
        }
    });
****
# Currency Exchange

## Todo
****
* [X] Provider
****
    Provider.generalSchema = new SimpleSchema({
        name: {
            type: String
        },
        registerDate: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY',
                        showTodayButton: true
                    }
                }
            }
        },
        status: {
            type: String,
            label: "Status",
            index: true,
            defaultValue: "E",
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: 'Enabled', value: 'E'},
                        {label: 'Disabled', value: 'D'},
                    ];
                }
            },
        },
        telephone: {
            type: String
        },
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            optional: true
        },
        address: {
            type: String,
            optional:true
        }
    });
****
* [X] Exchange Rate
****
    ExchangeRate.generalSchema = new SimpleSchema({
        productId: {
            type: String,
            label: "Product",
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "KHR", value: "KHR"},
                        {label: "USD", value: "USD"},
                        {label: "USD", value: "USD"}
                    ];
                }
            }
        },
        registerDate: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY',
                        showTodayButton: true
                    }
                }
            }
        },
        currencyFrom: {
            type: String,
            label:"Base Currency"
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "KHR", value: "KHR"},
                        {label: "USD", value: "USD"},
                        {label: "USD", value: "USD"}
                    ];
                }
            }
        }
    });
    ExchangeRate.convertSchema = new SimpleSchema({
        convert: {
            type: [Object],
            label: 'Convert Currency',
            minCount: 1
        },
        'convert.$.amount': {
            type: Number,
            label: 'Amount',
            decimal: true,
            min: 0.01,
        },
        'convert.$.currencyTo': {
            type: Number,
            label: 'Ex To',
            decimal: true,
            min: 0.01,
        },
        'convert.$.buy': {
            type: Number,
            label: 'Buy',
            decimal: true,
            min: 0.01,
        },
        'convert.$.sell': {
            type: Number,
            label: 'Sell',
            decimal: true,
            min: 0.01,
        },
        'convert.$.totalAmount': {
            type: Number,
            label: 'Sell',
            decimal: true,
            min: 0.01,
        }
    });
****
* [X] Exchange Transaction
****
    ExchangeTransaction.generalSchema = new SimpleSchema({
        productId: {
            type: String,
            label: "Product",
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    <!--return [-->
                        <!--{label: "KHR", value: "KHR"},-->
                        <!--{label: "USD", value: "USD"},-->
                        <!--{label: "USD", value: "USD"}-->
                    <!--];-->
                }
            }
        },
        exchangeDate: {
            type: Date,
            defaultValue: moment().toDate(),
            autoform: {
                afFieldInput: {
                    type: "bootstrap-datetimepicker",
                    dateTimePickerOptions: {
                        format: 'DD/MM/YYYY',
                        showTodayButton: true
                    }
                }
            }
        },
        customerId: {
            type: String,
            label:"Customer"
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "KHR", value: "KHR"},
                        {label: "USD", value: "USD"},
                        {label: "USD", value: "USD"}
                    ];
                }
            }
        }
    });
    ExchangeTransaction.exchangeSchema = new SimpleSchema({
        exchange: {
            type: [Object],
            label: 'Exchange',
            minCount: 1
        },
        'exchange.$.amount': {
            type: Number,
            label: 'Amount',
            decimal: true,
            min: 0.01,
        },
        'exchange.$.currencyFrom': {
            type: String,
            label: 'Exchange From',
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "KHR", value: "KHR"},
                        {label: "USD", value: "USD"},
                        {label: "USD", value: "USD"}
                    ];
                }
            }
        },
        'exchange.$.currencyTo': {
            type: String,
            label: 'Exchange To',
            autoform: {
                type: "select-radio-inline",
                options: function () {
                    return [
                        {label: "KHR", value: "KHR"},
                        {label: "USD", value: "USD"},
                        {label: "USD", value: "USD"}
                    ];
                }
            }
        },
        'exchange.$.totalAmount': {
            type: Number,
            label: 'Total Amount',
            decimal: true,
            min: 0.01,
        }
    });
****
### Changelog
- V 0.0.1 (17-08-2016)
    - init
### Changelog
- V 0.0.2 (19-09-2016)
    - init