var {google} = require('googleapis');

let sheetController = {
  viewSheet: async (req,res)=>{
    console.log('passando pelo controller');
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
    const client = await auth.getClient();
  
    const spreadsheetId = '1kYrCiRwiXHdOScvTPQGjd7w6NyJgSP_uzXYDuWtShZA';
  
    const googleSheets = google.sheets({ version: 'v4', auth: client});
  
    /*const metaData = await googleSheets.spreadsheets.get({
      auth, 
      spreadsheetId,
    })*/
    
    //cabeçalho de informações da tabela
    const getHeader = await googleSheets.spreadsheets.values.get({
      auth, 
      spreadsheetId,
      range:'engenharia_de_software',
    });

    const getColumns = await googleSheets.spreadsheets.values.get({
      auth, 
      spreadsheetId,
      range:'engenharia_de_software!A3:H3',
    });
    //
    const getTables = await googleSheets.spreadsheets.values.get({
      auth, 
      spreadsheetId,
      range:'engenharia_de_software!A4:H27',
    });
  
    let eachTable = getTables.data.values;
    
    //console.log(getRows.data.values[3])
    console.log(eachTable[1])

    let list = [];
    let classesN = 60;
    let abscPercentage = classesN/100 * 25;
  
    eachTable.map(function(array){
      let [reg, name, absence, t1, t2, t3, situation, grade] = array;
      if(absence > abscPercentage){
        situation = 'Reprovado por Falta';
      }

      list.push({
        reg,
        name,
        absence,
        t1,
        t2,
        t3,
        situation,
        grade
      })
    });
    

    res.render('index',{header:getHeader.data, columns:getColumns.data.values, list: list});
  
  }
}

module.exports = sheetController;