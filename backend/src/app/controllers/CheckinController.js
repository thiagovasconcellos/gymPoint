import * as Yup from 'yup';
import { subDays, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    // Students has a max check in numbers of 5 in 7 days. We need to check it!

    const studentsCheckIns = await Checkin.findAll({
      where: { student_id: req.params.student_id },
      date: {
        [Op.between]: [parseISO(new Date()), parseISO(subDays(new Date(), 7))],
      },
    });

    if (studentsCheckIns.length === 7) {
      return res.status(401).json({
        error:
          'You reached the max numbers of check-ins in one week. Its time for' +
          ' you to take some rest and come back later',
      });
    }

    await Checkin.create(req.body);

    return res.json({ message: 'Check in made successfully!' });
  }

  async show(req, res) {
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.student_id },
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
      ],
      attributes: ['createdAt'],
    });
    return res.json(checkins);
  }
}

export default new CheckinController();
