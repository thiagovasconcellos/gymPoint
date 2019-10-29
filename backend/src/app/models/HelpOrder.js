import Sequelize, { Model } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        question: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        answer: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        answer_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
  }
}

export default HelpOrder;
