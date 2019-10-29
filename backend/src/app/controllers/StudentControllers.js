import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      // .test(
      //   'len',
      //   'Name max size is set to 50 characters',
      //   val => val.length > 50
      // ),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { name } = req.body;
    if (name.length > 50) {
      return res
        .status(400)
        .json({ error: 'Name max size is set to 50 characters' });
    }

    const { email, age, weight, height } = await Student.create(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    const { name, email, age, weight, height } = req.body;

    const studentId = req.params.id;

    const student = await Student.findByPk(studentId);

    if (email !== student.email) {
      const userExists = await Student.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (name.length > 50) {
      return res
        .status(400)
        .json({ error: 'Name max size is set to 50 characters' });
    }

    const { id } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async show(req, res) {
    const response = await Student.findAll();
    return res.json(response);
  }
}

export default new StudentController();
