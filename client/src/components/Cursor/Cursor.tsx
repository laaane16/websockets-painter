export const Cursor = ({ x, y, username }: { x: number; y: number; username: string }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontWeight: 700,
        color: 'black',
        zIndex: 10,
        backgroundColor: 'white',
        padding: '3px',
        borderRadius: '5px',
      }}
    >
      {username}
    </div>
  );
};
