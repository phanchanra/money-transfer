Module = typeof Module === 'undefined' ? {} : Module;

Module.MoneyTransfer = {
    name: 'Money Transfer System',
    version: '2.0.0',
    summary: 'Money Transfer Management System is ...',
    roles: [
        'setting',
        'data-insert',
        'data-update',
        'data-remove',
        'reporter'
    ],
    dump: {
        setting: [
            'moneyTransfer_location'
        ],
        data: [
            'moneyTransfer_customer',
            'moneyTransfer_order'
        ]
    }
};
