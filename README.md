# Money Transfer

## Todo
* [ ] Product
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
* [ ] Customer
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
* [ ] Exchange
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
* [ ] CashIn
****
    CashIn.schema = new SimpleSchema({
        cashInDate: {
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
        'cash':{
            type:Object
        },
        'cash.KHR': {
            type: Number,
            label:"KHR"
        },
        'cash.USD': {
            type: Number,
            decimal:true,
            label:"USD"
        },
        'cash.THB': {
            type: Number,
            label:"THB"
        },
        branchId: {
            type: String
        }
    });
****
### Changelog
- V 0.0.1 (17-08-2016)
    - init