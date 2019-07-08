module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        name: {
            type: DataTypes.STRING(5),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: 'https://instagram.fyto1-1.fna.fbcdn.net/vp/8af07a763db06ec89f5608e480dc4401/5D7C0DF1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fyto1-1.fna.fbcdn.net',
        },
        introduce: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '소개글',
        },
    }, {
            timestamps: true,
            paranoid: true,
        })
);

