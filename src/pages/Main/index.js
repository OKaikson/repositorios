import React, { useState, useEffect, useCallback } from "react";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa"
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import api from "../../services/api";

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState([]);

    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos');

        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        async function submit() {
            setLoading(true);
            setAlert(null);
            if (newRepo === '') {
                throw new Error('Repositório não informado');
            }

            try {
                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = repositorios.find(repo => repo.name === newRepo);

                if (hasRepo) {
                    throw new Error('Repositório Duplicado');
                }

                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch (error) {
                console.log(error);
                setAlert(true);
            } finally {
                setLoading(false);
            }
        }

        submit();

    }, [newRepo]);

    function handleInputChange(e) {
        setAlert(null);
        setNewRepo(e.target.value);
    }

    const handleDelete = useCallback((repos) => {
        const find = repositorios.filter(r => r.name !== repos);

        setRepositorios(find);
    }, [repositorios])

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input
                    type="text"
                    placeholder="Adicionar Repositórios"
                    value={newRepo}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repos => (
                    <li key={repos.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repos.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repos.name}
                        </span>
                        <a href=""><FaBars size={20} /></a>
                    </li>
                ))}
            </List>
        </Container>
    )
}