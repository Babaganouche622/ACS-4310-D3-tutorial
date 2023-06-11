export default function D3() {
  d3.select('body')        // select an element to host
    .selectAll('div')			 // select all the elements you want to work with
    .data([5,6,2,8,4,9,1]) // define your data
    .enter()               // enter your data
    .append('div')         // append elements
    .text(d => `$${d.toFixed(2)}`) // Format the numbers
    .style('padding', '1em') // padding: 1em
    .style('background-color', 'red') // background-color: red
    .style('margin', '1px') // margin: 1px
    .style('width', (d) => `${d / 10 * 100}%`) // set width based on data
}