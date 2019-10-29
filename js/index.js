console.log("in the index js file")
//GLOBALS
let tableData,table

function init(){
 fetchData();
}

//run init function only
init()

//******* Objective 1 *************//
//download data
  function fetchData(){
    $.ajax('https://totalcloud-static.s3.amazonaws.com/intern.json',   // request url
    {
        success: function (data, status, xhr) {// success callback function
          console.log(data)
          //create table
          createTable(data);
          createVisualisation();
          findAllAvailableDates();
          createAvailabilityVisualisationData();
          createDatesParagraph();
          setTimeout(createAvailabilityVisualisation,2000)
          

    }
  });
  }

  //******* Objective  2 *************//
  //create table
  function createTable(data){
    tableData=data;
    table = new Tabulator("#example-table", {
      addRowPos:"top",          //when adding a new row, add it to the top of the table
      pagination:"local",       //paginate the data
      paginationSize:5,         //allow 7 rows per page of data
      movableColumns:true,      //allow column order to be changed
      resizableRows:true,       //allow row order to be changed
      height:208, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
      data:tableData, //assign data to table
      layout:"fitColumns", //fit columns to width of table (optional)
      columns:[ //Define Table Columns
        {title:"Name", field:"name", align:"center"},
        {title:"Start Date", field:"start", sorter:"date" , align:"center"},
        {title:"Due Date", field:"end", sorter:"date" , align:"center"},
      ]
    });
  }

  //******* Objective  3 *************//
  //create visualisation
  function createVisualisation(){
   am4core.ready(function() {
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  
  chart.paddingRight = 30;
  chart.dateFormatter.inputDateFormat = "dd/MM/yyyy";
  
  var colorSet = new am4core.ColorSet();
  colorSet.saturation = 0.4;
  chart.data=tableData
  var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "id";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.inversed = true;
  
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.dateFormatter.dateFormat = "dd/MM/yyyy";
  dateAxis.renderer.minGridDistance = 70;
  dateAxis.baseInterval = { count: 30, timeUnit: "minute" };
  dateAxis.max = new Date(2019, 09, 1, 24, 0, 0, 0).getTime();
  dateAxis.strictMinMax = true;
  dateAxis.renderer.tooltipLocation = 0;
  
  var series1 = chart.series.push(new am4charts.ColumnSeries());
  series1.columns.template.width = am4core.percent(80);
  series1.columns.template.tooltipText = "{name}: {openDateX} - {dateX}";
  
  series1.dataFields.openDateX = "start";
  series1.dataFields.dateX = "end";
  series1.dataFields.categoryY = "id";
  series1.columns.template.propertyFields.fill = "color"; // get color from data
  series1.columns.template.propertyFields.stroke = "color";
  series1.columns.template.strokeOpacity = 1;
  
  chart.scrollbarX = new am4core.Scrollbar();
  
  }); // end am4core.ready()
  }

    //******* Objective  4 *************//
  //Show availablilty visualisation
  let availableDates=[],minDate='01/09/2019',maxDate='31/09/2019';
  let curDate=minDate,i=0;

  function findAllAvailableDates(){
     while(process(curDate)<=process(maxDate)){
       for(i=0;i<tableData.length;i++){
       //  console.log(tableData[i])
         if(process(curDate)>=process(tableData[i].start)&&process(curDate)<=process(tableData[i].end)){
             console.log('date falls in range')
             break
         }else{
           console.log(curDate)
           console.log(tableData[i].start,tableData[i].end,tableData[i].name)

           console.log('date does not fall in range ')
         }
       }
       if(i===tableData.length){
         availableDates.push(curDate)
         i=0
       }else{
         i=0
       }
       curDate=increaseDate(curDate)
     }
     console.log('available dates are ',availableDates)
  }
  function process(date){
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  function increaseDate(date){
      var cur = process(date);
      var dd = cur.getDate()+1;
      var mm = cur.getMonth()+1;
      var yyyy = cur.getFullYear();
      cur = dd+'/0'+mm+'/'+yyyy;
      return cur;   
    }
    let avVisData=[];
  function createAvailabilityVisualisationData(){
    
      for(let k=0;k<availableDates.length-1;k++){
        avVisData.push({
          'id':1,
          'name':'All',
          'start':availableDates[k],
          'end':availableDates[k+1]
        })
      }
    
    console.log('availability visualisation data ',avVisData)
  }

  function createAvailabilityVisualisation(){
    
   // Themes begin
   am4core.useTheme(am4themes_animated);
   // Themes end
   
   var chart2 = am4core.create("chartdiv2", am4charts.XYChart);
   chart2.hiddenState.properties.opacity = 0; // this creates initial fade-in
   
   chart2.paddingRight = 30;
   chart2.dateFormatter.inputDateFormat = "dd/MM/yyyy";
   
   var colorSet = new am4core.ColorSet();
   colorSet.saturation = 0.4;
   chart2.data=avVisData
   var categoryAxis = chart2.yAxes.push(new am4charts.CategoryAxis());
   categoryAxis.dataFields.category = "name";
   categoryAxis.renderer.grid.template.location = 0;
   categoryAxis.renderer.inversed = true;
   
   var dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
   dateAxis.dateFormatter.dateFormat = "dd/MM/yyyy";
   dateAxis.renderer.minGridDistance = 70;
   dateAxis.baseInterval = { count: 30, timeUnit: "minute" };
   dateAxis.min = new Date(2019, 08, 8, 24, 0, 0, 0).getTime();
   dateAxis.max = new Date(2019, 08, 30, 24, 0, 0, 0).getTime();
   dateAxis.strictMinMax = true;
   dateAxis.renderer.tooltipLocation = 0;
   
   var series1 = chart2.series.push(new am4charts.ColumnSeries());
   series1.columns.template.width = am4core.percent(80);
   series1.columns.template.tooltipText = "{name}: {openDateX} - {dateX}";
   
   series1.dataFields.openDateX = "start";
   series1.dataFields.dateX = "end";
   series1.dataFields.categoryY = "name";
   series1.columns.template.propertyFields.fill = "color"; // get color from data
   series1.columns.template.propertyFields.stroke = "color";
   series1.columns.template.strokeOpacity = 1;
   
   chart2.scrollbarX = new am4core.Scrollbar();
   
  
  }
  function createDatesParagraph(){
    let dateStr=""
    for(let l=0;l<availableDates.length;l++){
      dateStr+=availableDates[l]+"  to "
    }
    console.log('date string ',dateStr)
    $("p").first().text(dateStr);
  }

    
  

  


