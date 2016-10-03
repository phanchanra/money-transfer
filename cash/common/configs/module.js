Module = typeof Module === 'undefined' ? {} : Module;

Module.Cash = {
    name: 'Cash System',
    version: '0.0.1',
    summary: 'Cash is ...',
    roles: [
        'setting',
        'insert',
        'update',
        'remove',
        'report'
    ],
    dump: {
        setting: [
            'cash_location'
        ],
        data: [
            'cash_chartCash',
            'cash_transaction'
        ]
    }
};
