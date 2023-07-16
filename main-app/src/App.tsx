import  { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Spinner } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from 'antd';

interface IFlat {
  id: number;
  title: string;
  img_url: string;
}

const App = () => {
  const [flats, setFlats] = useState<IFlat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const flatsPerPage = 12;
  const totalFlats = 100;

  useEffect(() => {
    const fetchFlats = async () => {
      const startIndex = (currentPage - 1) * flatsPerPage;
      const endIndex = Math.min((startIndex + flatsPerPage), totalFlats);
      const response = await axios.get<IFlat[]>(`api/flats?start=${startIndex}&end=${endIndex}`);
      setLoading(true);
      setFlats(response.data);
    };
    fetchFlats();
  }, [currentPage]);

  const handlePageChange = (selected:number) => {
    setCurrentPage(selected);
  };

  return (
    <div className='app'>
      <Header />
      <div className='content-heading-container'>
        <h2>Flats for sale</h2>
        <hr />
      </div>
      <div className='main-content-container'>
        {loading ? <MainContent flats={flats} handlePageChange={handlePageChange} totalFlats={totalFlats} flatsPerPage={flatsPerPage} currentPage={currentPage} /> : <div className='spinner-container'><Spinner className='custom-spinner'></Spinner></div>}
      </div>
      <Footer />
    </div>
  );
};

const MainContent = ({ flats, handlePageChange, totalFlats, flatsPerPage, currentPage }: {
  flats: IFlat[],
  handlePageChange: (selected: number) => void,
  totalFlats: number,
  flatsPerPage: number,
  currentPage: number
}) => {
  return (
    <>
      <div className='flat-list'>
        {flats.map((flat) => (
          <Flat key={flat.id} {...flat} />
        ))}
      </div>
      <div className='pagination-container'>
        <Pagination
        className='custom-pagination'
        current={currentPage}
        onChange={handlePageChange}
        defaultCurrent={1}
        defaultPageSize={flatsPerPage}
        total={totalFlats}
        showSizeChanger = {false}
        />
      </div>
    </>
  );
};

const Flat = ({ title, img_url }: IFlat) => {
  return (
    <div className='flat-container'>
      <div className='image-container'>
        <img src={img_url} alt={title} />
      </div>
      <div className='text-overlay'>
        <h3>{title}</h3>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header>
    <img src="https://www.sreality.cz/img/logo-sreality.svg" alt="logo" /> 
    </header>
  );
};

const Footer = () => {
  return (
    <footer><p>© Adam Ješina 2023</p></footer>
  );
};

export default App;
