import Sequelize, { Model } from 'sequelize';

class StudentRegistration extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        end_date: {
          type: Sequelize.DATE,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
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
    this.belongsTo(models.Membership, { foreignKey: 'membership_id' });
  }
}

export default StudentRegistration;
