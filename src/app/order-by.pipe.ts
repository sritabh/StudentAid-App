import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  async transform(value: any[], propertyName: string): Promise<any[]> {
    //console.log(value.sort())
    var sortable=[];
    for (var i=0;i<value.length;i++) {
      sortable.push([value[i][1]['Profile']['Name'],value[i]]);
      //console.log(await value[i][1]['Profile']['Name'])
    }
    sortable.sort((a,b) => {
      if (a[0] > b[0]) {
        return 1;
    }
    if (b[0] > a[0]) {
        return -1;
    }
    return 0;
  });
  var sortedName = []
  sortable.forEach(function(item){
    sortedName.push(item[1])
  })

  
  console.log(sortedName)
  return await sortedName;
  }
}
