const { syncAndSeed, models: { Color, Shape, Block } } = require('./db');
const express = require('express');
const app = express();
const path = require('path');


app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(require('express').urlencoded({ extended: false }));


app.post('/blocks', async(req, res, next)=> {
  try {
    await Block.create(req.body);
    res.redirect('/');
  }
  catch(ex){
    next(ex);
  }
});

app.get('/', async(req, res, next)=> {
  try {
    const [shapes, colors, blocks ] = await Promise.all([
      Shape.findAll(),
      Color.findAll(),
      Block.findAll({
        include: [ Color, Shape ]
      })
    ]);
    res.send(`
      <html>
        <head>
          <title>Acme Blocks</title>
          <link rel='stylesheet' href='/assets/styles.css' />
        </head>
        <body>
          <h1><a href='/'>Acme Blocks</a></h1>
          <main>
            <section>
              <h1>Create Block</h1>
              <form method='POST' action='/blocks'>
                <select name='colorId'>
                  ${
                    colors.map( color => {
                      return `
                        <option value='${color.id}'>${color.name}</option>
                      `;
                    }).join('')
                  }
                </select>
                <select name='shapeId'>
                  ${
                    shapes.map( shape => {
                      return `
                        <option value='${shape.id}'>${shape.name}</option>
                      `;
                    }).join('')
                  }
                </select>
                <button>Create</button>
              </form>
            </section>
            <section>
              <h2>Colors</h2>
              <ul>
                ${
                  colors.map( color => {
                    return `
                      <li>
                        ${ color.name }
                      </li>
                    `;
                  }).join('')
                }
              </ul>
            </section>
            <section>
              <h2>Shapes</h2>
              <ul>
                ${
                  shapes.map( shape => {
                    return `
                      <li>
                        ${ shape.name }
                      </li>
                    `;
                  }).join('')
                }
              </ul>
            </section>
            <section>
              <h2>Blocks</h2>
              <ul>
                ${
                  blocks.map( block => {
                    return `
                      <li>
                        ${ block.color.name }
                        ${ block.shape.name }
                      </li>
                    `;
                  }).join('')
                }
              </ul>
            </section>
          </main>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

const doIt = async()=> {
  try {
    await syncAndSeed();
    console.log('synced and seeded');
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

doIt();
