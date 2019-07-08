module.exports = (sequelize, DataTypes) => (
    sequelize.define('hashtag', {
        tagname: {
            type: DataTypes.STRING(30),
            allowNull: true,
            unique: true,
        },
    }, {
            timestamps: true,
            paranoid: true,
        })
);

