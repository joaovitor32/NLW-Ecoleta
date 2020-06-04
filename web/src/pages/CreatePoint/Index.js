import React, { useEffect, useState } from 'react';

import './styles.css';
import logo from '../../assets/logo.svg'
import { Link,useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../services/api';
import axios from 'axios';

const CreatePoint = () => {

    const history=useHistory();
    const [items, setItems] = useState([]);
    const [ufs, setUFS] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCidade,setSelectedCidade]=useState();
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedPosition,setSelectedPosition]=useState([0,0])
    const [initialPosition,setInitialPosition]=useState([0,0])
    const [selectedItems,setSelectedItems]=useState([]);
    const [formData,setFormData]=useState({
        name:'',
        email:'',
        whatsapp:'',
    })

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data);
        })
    }, [])

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla);
                setUFS(ufInitials);
            })
    }, [])

    useEffect(() => {
        if (selectedUf === 0) {
            return;
        }
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);
                setCity(cityNames)
            });
    }, [selectedUf])

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude,longitude}=position.coords;
            setInitialPosition([latitude,longitude]);
        })
    },[])

    const handleSelectedUF = (event) => {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    const handleSelectedCidade = (event) => {
        const cidade = event.target.value;
        setSelectedCidade(cidade);
    }

    const handleMapClick=(event)=>{
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    const handleInputChange=(event)=>{
        const {name,value}=event.target;
        setFormData({...formData,[name]:value});
    }

    const handleSelectedItem=(id)=>{
        const alreadySelected=selectedItems.findIndex(item=>item===id);

        if(alreadySelected>=0){
            const filteredItems=selectedItems.filter(item=>item!==id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems,id])
        }
    }

    const handleSubmit=async(event)=>{
        event.preventDefault();
        const {name,email,whatsapp}=formData;
        const uf=selectedUf;
        const cidade=selectedCidade;
        const [latitude,longitude]=selectedPosition;
        const items=selectedItems;

       

        const data={
            name,
            email,
            whatsapp,
            uf,
            city:cidade,
            latitude,
            longitude,
            items
        }
       
       await api.post('points',data);
        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="logo" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados:</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatspapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço:</h2>
                        <span>Selecione o endereço no  mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select onChange={handleSelectedUF} value={selectedUf} name="uf" id="uf">
                                <option value="0">Selecione uma uf</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf} >{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select  onChange={handleSelectedCidade} value={selectedCidade} name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {city.map(cidade => (
                                    <option key={cidade} value={cidade}>{cidade}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta:</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} 
                                onClick={()=>{handleSelectedItem(item.id)}}
                                className={selectedItems.includes(item.id)?'selected':''}
                           >
                                <img src={item.imageUrl} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar Ponto
                </button>
            </form>
        </div>
    )
}

export default CreatePoint;