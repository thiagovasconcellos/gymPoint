import Sequelize, { Model } from 'sequelize';

class Membership extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING(150),
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL(10, 2),
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Membership;
