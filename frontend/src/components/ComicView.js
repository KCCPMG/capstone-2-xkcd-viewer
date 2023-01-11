import { useParams } from 'react-router-dom';
import Comic from './Comic';

function ComicView() {
  const {comicNum} = useParams();

  return (
    <>
      <Comic comicNum={comicNum} navControls={true} />
    </>
  )
}

export default ComicView;