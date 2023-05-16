interface Props {
  id: string
}

const ReviewModal = ({id} : Props) => {
  return (
    <div id={id} className="modal">
      <div className="modal-box">
        <h1>Test Modal</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ex neque at quibusdam fuga debitis quis reprehenderit. Fugit nihil inventore mollitia cupiditate necessitatibus impedit est, molestias fugiat sit dolorum quam.</p>
        <div className="modal-action">
          <a href="#">Hello World</a>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;