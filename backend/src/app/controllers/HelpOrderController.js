import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import NewAnswerMail from '../jobs/NewAnswerMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    // Students has a max check in numbers of 5 in 7 days. We need to check it!

    const alreadyAnswered = await HelpOrder.findAll({
      where: { question: req.body.question, student_id: req.body.student_id },
    });

    if (alreadyAnswered.length > 0) {
      return res
        .status(401)
        .json({ error: 'You already asked this question.' });
    }

    await HelpOrder.create(req.body);

    return res.json({ message: 'Your question was successfully created.' });
  }

  async show(req, res) {
    const questions = await HelpOrder.findAll({
      where: { answer: null },
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
      ],
      attributes: ['question', 'createdAt'],
    });
    return res.json(questions);
  }

  async index(req, res) {
    const questions = await HelpOrder.findAll({
      where: { student_id: req.params.id },
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
      ],
      attributes: ['question', 'answer', 'answer_at', 'createdAt'],
    });

    if (questions.length === 0) {
      return res.json({ message: 'No results founds' });
    }
    return res.json(questions);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    const question = await HelpOrder.findByPk(req.params.id);

    if (!question) {
      return res.status(400).json({ error: 'This question does not exists' });
    }

    if (question.answer !== null) {
      return res
        .status(401)
        .json({ error: 'This question was already been answered.' });
    }

    const student = await Student.findByPk(question.student_id);

    question.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(NewAnswerMail.key, {
      student,
      question,
      answer: req.body.answer,
    });

    return res.json('You answer was saved with success');
  }
}

export default new HelpOrderController();
