import React, { useState, useEffect } from 'react';
import { getUser } from '../../store/auth.ts';
import { getEnderecos, addEndereco, updateEndereco, deleteEndereco, type Endereco, type EnderecoPayload } from '../../services/cliente.ts';
import styles from './MeusEnderecos.module.css';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface ModalProps {
  endereco: Endereco | null;
  onClose: () => void;
  onSave: (payload: EnderecoPayload) => Promise<void>;
}

function EnderecoModal({ endereco, onClose, onSave }: ModalProps) {
  const [formData, setFormData] = useState<EnderecoPayload>({
    logradouro: '', numero: '', bairro: '', cidade: '', estado_siga: '', cep: ''
  });
  const [cepError, setCepError] = useState<string | null>(null);

  useEffect(() => {
    if (endereco) {
      setFormData({
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado_siga: endereco.estado_siga,
        cep: endereco.cep
      });
    }
  }, [endereco]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cep') {
      const cleanedValue = value.replace(/\D/g, '').slice(0, 8);
      setFormData({ ...formData, cep: cleanedValue });

      if (cleanedValue.length === 8) {
        setCepError(null);
      } else {
        setCepError('O CEP deve conter exatamente 8 dígitos.');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cep.length !== 8) {
      setCepError('O CEP deve conter exatamente 8 dígitos.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{endereco ? 'Editar Endereço' : 'Adicionar Novo Endereço'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="logradouro">Rua / Avenida</label>
            <input
              id="logradouro"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleChange}
              placeholder="Rua Cristóvão de Jesus"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              placeholder="409C"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bairro">Bairro</label>
            <input
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              placeholder="Jardim Nova Barra"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              placeholder="Barra do Garças"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="estado_siga">UF</label>
            <input
              id="estado_siga"
              name="estado_siga"
              value={formData.estado_siga}
              onChange={handleChange}
              placeholder="MT"
              maxLength={2}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cep">CEP</label>
            <input
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="65665000"
              maxLength={8}
              required
              className={cepError ? styles.inputError : ''}
            />
            {cepError && <span className={styles.errorMessage}>{cepError}</span>}
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MeusEnderecos() {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null);

  const fetchEnderecos = async () => {
    const user = getUser();
    if (user?.id_cliente) {
      try {
        const data = await getEnderecos(user.id_cliente);
        setEnderecos(data);
      } catch (err) {
        setError("Não foi possível carregar seus endereços.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Cliente não identificado.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnderecos();
  }, []);

  const handleSave = async (payload: EnderecoPayload) => {
    const user = getUser();
    if (!user?.id_cliente) return;

    try {
      if (editingEndereco) {
        await updateEndereco(editingEndereco.id_endereco, payload);
      } else {
        await addEndereco(user.id_cliente, payload);
      }
      closeModal();
      await fetchEnderecos();
    } catch (err) {
      alert("Erro ao salvar endereço. Verifique os dados.");
    }
  };

  const handleDelete = async (id_endereco: number) => {
    if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
      try {
        await deleteEndereco(id_endereco);
        await fetchEnderecos();
      } catch (err) {
        alert("Não foi possível excluir o endereço.");
      }
    }
  };

  const openModal = (endereco: Endereco | null = null) => {
    setEditingEndereco(endereco);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEndereco(null);
  };

  if (isLoading) return <p className={styles.message}>Carregando...</p>;
  if (error) return <p className={styles.messageError}>{error}</p>;

  return (
    <div className={styles.container}>
      {isModalOpen && <EnderecoModal endereco={editingEndereco} onClose={closeModal} onSave={handleSave} />}
      <div className={styles.header}>
        <h1>Meus Endereços</h1>
        <button className={styles.addButton} onClick={() => openModal()}>
          <PlusCircle size={20} />
          <span>Adicionar Endereço</span>
        </button>
      </div>
      
      <div className={styles.cardsContainer}>
        {enderecos.length === 0 ? (
          <p className={styles.message}>Nenhum endereço cadastrado.</p>
        ) : (
          enderecos.map(end => (
            <div key={end.id_endereco} className={styles.card}>
              <div className={styles.cardContent}>
                <p><strong>{end.logradouro}, {end.numero}</strong></p>
                <p>{end.bairro}, {end.cidade} - {end.estado_siga}</p>
                <p>CEP: {end.cep}</p>
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => openModal(end)}><Edit size={18} /></button>
                <button onClick={() => handleDelete(end.id_endereco)}><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}