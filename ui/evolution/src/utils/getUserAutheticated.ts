import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const useFetchUserData = (skipAuth = false) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    position: '',
    photo: '',
    profession: '',
    role: '',
    gender: '',
    userId: '',
  });
  const [loan, setLoan] = useState({
    amountDue: 0,
    balanceDue: 0,
    status: '',
    totalDays: 0,
    daysLeft: 30,
    createdAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (skipAuth) {
      // Não faz nada no simulador
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const userData = response.data.user;

        if (userData.role === 'ADMIN' || userData.role === 'MASTER') {
          setUser({
            name: userData.username,
            email: userData.email,
            position: '',
            profession: '',
            photo: userData.gender,
            role: userData.role,
            gender: userData.gender,
            userId: userData.userId
          });
          setLoan({
            amountDue: 0,
            balanceDue: 0,
            status: '',
            totalDays: 0,
            daysLeft: 0,
            createdAt: ''
          });
        } else if (userData.role === 'USER') {
          const genderPhoto = userData.gender === 'Femenino' ? '/profile/2.jpg' : '/profile/1.jpg';
          setUser({
            name: userData.fullName,
            email: userData.email,
            position: userData.incomeSource,
            profession: userData.profession,
            photo: userData.photo || genderPhoto,
            role: userData.role,
            gender: userData.gender,
            userId: userData.userId
          });
          setLoan({
            amountDue: userData.loan?.loanAmount || 0,
            balanceDue: userData.loan?.balanceDue || 0,
            status: userData.loan?.status || 'PENDING',
            totalDays: userData.loan?.paymentTerm * 30 || 30,
            daysLeft: 30,
            createdAt: userData.loan?.createdAt || ''
          });
        }
      } catch (err) {
        setError('Erro ao carregar os dados do usuário');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, skipAuth]);

  return { user, loan, loading, error };
};

export { useFetchUserData };
