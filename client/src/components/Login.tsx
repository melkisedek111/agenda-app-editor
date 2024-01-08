import React, { useState } from 'react';

type TDraggableTableRow = {
    rowData: any; index: any; moveRow: any;
}

const DraggableTableRow = ({ rowData, index, moveRow }: TDraggableTableRow) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: any) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const toIndex = index;
    moveRow(fromIndex, toIndex);
  };

  return (
    <tr
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {rowData.map((cellData: any, cellIndex: any) => (
        <td key={cellIndex}>{cellData}</td>
      ))}
    </tr>
  );
};

const Table = () => {
    const initialData = [
      ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
      ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
      ['Row 3 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
      ['Row 4 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
      ['Row 5 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
      // Add more rows as needed...
    ];
  
    const [data, setData] = useState(initialData);
  
    const moveRow = (fromIndex: any, toIndex: any) => {
      const newData = [...data];
      const [removed] = newData.splice(fromIndex, 1);
      newData.splice(toIndex, 0, removed);
      setData(newData);
    };
  
    return (
      <table>
        <tbody>
          {data.map((rowData, index) => (
            <DraggableTableRow
              key={index}
              rowData={rowData}
              index={index}
              moveRow={moveRow}
            />
          ))}
        </tbody>
      </table>
    );
  };
  
  export default Table;
