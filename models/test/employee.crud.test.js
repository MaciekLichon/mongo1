const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.error(err);
    }
  });

  after(() => {
    mongoose.models = {};
  });

  describe('CRUD: Reading data', () => {

    before(async () => {
      const testEmpOne = new Employee({ firstName: "John", lastName: "Doe", department: 'Dep #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: "Amanda", lastName: "Doee", department: 'Dep #2' });
      await testEmpTwo.save();
    });

    after(async () => {
      await Employee.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;

      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName", "lastName" or "department" with "findOne" method', async () => {
      const employeeTestOne = await Employee.findOne({ firstName: 'John' });
      const expectedFirstName = 'John';
      expect(employeeTestOne.firstName).to.be.equal(expectedFirstName);

      let employeeTestTwo = await Employee.findOne({ lastName: 'Doe' });
      const expectedLastName = 'Doe';
      expect(employeeTestTwo.lastName).to.be.equal(expectedLastName);

      let employeeTestThree = await Employee.findOne({ department: 'Dep #1' });
      const expectedDepartment = 'Dep #1';
      expect(employeeTestThree.department).to.be.equal(expectedDepartment);
    });

  });

  describe('CRUD: Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: "John", lastName: "Doe", department: 'Dep #1' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });

  });

  describe('CRUD: Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: "John", lastName: "Doe", department: 'Dep #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: "Amanda", lastName: "Doee", department: 'Dep #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { $set: { firstName: 'Tom' }});
      const updatedEmployee = await Employee.findOne({ firstName: 'Tom' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      employee.firstName = 'Tom';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Tom' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'Updated lastName' }});
      const employees = await Employee.find({ lastName: 'Updated lastName' });
      expect(employees.length).to.be.equal(2);
    });

  });

  describe('CRUD: Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: "John", lastName: "Doe", department: 'Dep #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: "Amanda", lastName: "Doee", department: 'Dep #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const removedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'Amanda' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

  });

});
