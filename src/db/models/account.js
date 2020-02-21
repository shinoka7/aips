module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
      provider:             { type: DataTypes.STRING, unique: 'unique_provider_accountId' },
      accountId:            { type: DataTypes.STRING, unique: 'unique_provider_accountId' },
  }, { freezeTableName: true });

  // association
  Account.associate = (models) => {
    Account.belongsTo(models.User);
  };

  /**
   * create or link an account
   * 
   * @param {string} provider
   * @param {string} accountId
   * @param {object} username when user is not found
   * @returns {Promise<Account>}
   * @memberof Account
   */
  Account.createOrLink = async function(provider, accountId, username) {
    const { User } = require('.');

    let account = await Account.findOne({
        where: {
            provider, accountId
        }
    });

    if (!account) {
        const user = await User.create({ username, email: username });
        account = await Account.create({
            provider,
            accountId,
            UserId: user.id
        });
    }

    account = await account.reload({ include: [{ model: User }] });
    return account;
  };

  Account.linkAccount = async function(provider, accountId, userId) {
      const { User } = require('.');
  
      let account = await Account.findOne({
          where: {
              provider, accountId
          }
      });

      if (!account) {
          account = await Account.create({
            provider,
            accountId,
            UserId: userId
          });
      }

      account = await account.reload({ include: [{ model: User  }] });
      return account;
  };

  return Account;
};