const { syncAndSeed } = require('./db');

const doIt = async()=> {
  try {
    await syncAndSeed();
    console.log('synced and seeded');
  }
  catch(ex){
    console.log(ex);
  }
};

doIt();
