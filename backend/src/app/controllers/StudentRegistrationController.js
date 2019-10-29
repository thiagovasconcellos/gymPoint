import * as Yup from 'yup';
import { isBefore, parseISO, addMonths } from 'date-fns';
import Registration from '../models/StudentRegistration';
import Membership from '../models/Membership';
import Student from '../models/Student';

import RegisterMail from '../jobs/RegisterMail';
import Queue from '../../lib/Queue';

class StudentRegistration {
  async show(req, res) {
    const response = await Registration.findAll({
      include: [
        {
          model: Student,
          attributes: ['name', 'email', 'age'],
        },
        {
          model: Membership,
          attributes: ['title', 'price'],
        },
      ],
      attributes: ['start_date', 'end_date', 'price'],
    });
    return res.json(response);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      membership_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    const studentRegistrationExists = await Registration.findOne({
      where: {
        student_id: req.body.student_id,
      },
    });

    if (studentRegistrationExists) {
      return res.status(400).json({
        error:
          'You are trying to create a registration to a student that already' +
          ` has registration. Please cancel this registration: ${studentRegistrationExists.id}(id)`,
      });
    }

    const { start_date } = req.body;

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(401).json({
        error: 'You cannot register with a past date. Please be careful',
      });
    }

    const membership = await Membership.findByPk(req.body.membership_id);

    const end_date = addMonths(parseISO(start_date), membership.duration);
    const price = membership.duration * membership.price;

    const { student_id, membership_id } = req.body;

    const student = await Student.findByPk(student_id);

    await Registration.create({
      student_id,
      membership_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(RegisterMail.key, {
      student,
      membership,
      start_date,
      end_date,
      price,
    });

    return res.json({ message: 'Registration done!' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      membership_id: Yup.number().required(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    const { start_date } = req.body;

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(401).json({
        error: 'You cannot register with a past date. Please be careful',
      });
    }

    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(401).json({
        error:
          'This registration doest not exists. Please check out and try again',
      });
    }

    if (registration.student_id !== req.body.student_id) {
      return res.status(401).json({
        error:
          'You are not supposed to edit a student from a registration. Create a new one instead',
      });
    }

    if (registration.membership_id !== req.body.membership_id) {
      const membership = await Membership.findByPk(req.body.membership_id);

      registration.end_date = addMonths(
        parseISO(req.body.start_date),
        membership.duration
      );
      registration.price = membership.duration * membership.price;
    }

    await registration.update({
      membership_id: req.body.membership_id,
      end_date: registration.end_date,
      price: registration.price,
    });

    return res.json({ message: 'Registration updated with successs!' });
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    await registration.destroy();

    return res
      .status(200)
      .json({ ok: `Membership: ${registration.id} deleted` });
  }
}

export default new StudentRegistration();
