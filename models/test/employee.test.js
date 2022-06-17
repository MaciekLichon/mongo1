const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');


it('employee: should throw an error if any arg (firstName, lastName, department) is missing', () => {
  const emp = new Employee({});

  emp.validate(err => {
    expect(err.errors.firstName).to.exist;
    expect(err.errors.lastName).to.exist;
    expect(err.errors.department).to.exist;
  });
});

it('employee: should throw an error if any arg (firstName, lastName, department) is not a string', () => {

  const cases = [{}, []];

  for (let item of cases) {
    const emp = new Employee({ firstName: item, lastName: item, department: item });

    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  }
});

it('employee: should not throw an error if all args (firstName, lastName, department) are okay', () => {

  const cases = ['StringOne', 'StringTwo'];

  for (let item of cases) {
    const emp = new Employee({ firstName: item, lastName: item, department: item });

    emp.validate(err => {
      expect(err).to.not.exist;
    });
  }
});

after(() => {
  mongoose.models = {};
});
