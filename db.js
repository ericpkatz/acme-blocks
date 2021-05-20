const Sequelize = require('sequelize');

//const { DataTypes: { STRING, INTEGER }} = Sequelize;
const STRING = Sequelize.DataTypes.STRING;
const INTEGER = Sequelize.DataTypes.INTEGER;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db');


const Color = conn.define('color', {
  name: STRING
});

const Shape = conn.define('shape', {
  name: STRING
});

const Block = conn.define('block', {
});

Block.belongsTo(Color);
Block.belongsTo(Shape);
Shape.hasMany(Block);
Color.hasMany(Block);

const data = {
  colors: ['red', 'blue', 'green', 'dodgerBlue', 'cornsilk'],
  shapes: ['circle', 'square']
};


const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const colors = Promise.all(data.colors.map( name => Color.create({ name })));
  const shapes = Promise.all(data.shapes.map( name => Shape.create({ name })));
  const results = await Promise.all([ colors, shapes ]);
  const red = results[0][0];
  const green = results[0][2];
  const circle = results[1][0];
  const square = results[1][1];
  await Promise.all([
    Block.create({
      colorId: red.id,
      shapeId: square.id
    }),
    Block.create({
      colorId: red.id,
      shapeId: square.id
    }),
    Block.create({
      colorId: green.id,
      shapeId: circle.id
    }),
    Block.create({
      colorId: red.id,
      shapeId: circle.id
    })

  ]);
};

module.exports = {
  syncAndSeed,
  models: {
    Color,
    Shape,
    Block
  }
};
