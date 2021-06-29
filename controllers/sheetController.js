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
      
    //cabeçalho de informações da tabela
    const getHeader = await googleSheets.spreadsheets.values.get({
      auth, 
      spreadsheetId,
      range:'engenharia_de_software',
    });

    //nome das colunas
    const getColumns = await googleSheets.spreadsheets.values.get({
      auth, 
      spreadsheetId,
      range:'engenharia_de_software!A3:H3',
    });

    //dados das linhas
    const getTables = await googleSheets.spreadsheets.values.get({
      auth, 
      spreadsheetId,
      range:'engenharia_de_software!A4:H27',
    });

    //separar cada array
    let eachTable = getTables.data.values;

    let dataList = [];
    let classesN = 60;
    let abscPercentage = classesN/100 * 25;
  
    eachTable.map(function(array){
      console.log('separando cada dado do array para atribuir a um objeto')
      let [reg, name, absence, t1, t2, t3, situation, finalGradeApproval] = array;

      //transformando notas do array em numero inteiro
      t1 = (parseInt([t1]))
      t2 = (parseInt([t2]))
      t3 = (parseInt([t3]))

      let grade = parseInt((t1 + t2 + t3) / 3);
      let averageGradeMin = 5;
      let averageGradeMax = 7;
      let finalExameCalc = parseInt((grade+finalGradeApproval)/2);

      if(averageGradeMin <= grade|| grade < averageGradeMax){
        situation = 'Exame Final';
      }
      if(grade < averageGradeMin){
        situation = 'Reprovado por Nota';
      }
      if(absence > abscPercentage){
        situation = 'Reprovado por Falta';
      }

      if(situation == 'Exame Final'){
        if(averageGradeMin<=finalExameCalc){
          finalGradeApproval = finalExameCalc;
        }
        else{
          finalGradeApproval = 0;
          situation = 'Aprovado';
        }
      }
  
      dataList.push({
        reg,
        name,
        absence,
        t1,
        t2,
        t3,
        situation,
        finalGradeApproval
      })

    });
    
    res.render('index',{header:getHeader.data, columns:getColumns.data.values, list: dataList});
    console.log('renderizando a view index com as informações para formação da tabela.')
  }
}

module.exports = sheetController;