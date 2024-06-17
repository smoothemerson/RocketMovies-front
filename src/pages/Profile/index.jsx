import { useState, useEffect } from "react";
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/auth";

import avatarPlaceholder from "../../assets/avatar_placeholder.svg";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Container, Form, Avatar } from "./styles";

import { api } from "../../services/api";

export function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [passwordOld, setPasswordOld] = useState();
  const [passwordNew, setPasswordNew] = useState();

  const avatarURL = user.avatar
    ? `${api.defaults.baseURL}/files/${user.avatar}`
    : avatarPlaceholder;
  const [avatar, setAvatar] = useState(avatarURL);
  const [originalAvatar, setOriginalAvatar] = useState(avatarURL);
  const [avatarFile, setAvatarFile] = useState(null);

  const [isChanged, setIsChanged] = useState(false);

  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  async function handleUpdate() {
    const updated = {
      name,
      email,
      password: passwordNew,
      old_password: passwordOld,
    };

    const userUpdated = Object.assign(user, updated);
    await updateProfile({ user: userUpdated, avatarFile });

    if (avatarFile) {
      const newAvatarURL = URL.createObjectURL(avatarFile);
      setAvatar(newAvatarURL);
      setOriginalAvatar(newAvatarURL);
    }

    setIsChanged(false);
  }

  function handleChangeAvatar(event) {
    const file = event.target.files[0];
    setAvatarFile(file);

    const imagePreview = URL.createObjectURL(file);
    setAvatar(imagePreview);
    setIsChanged(true);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleUpdate();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [name, email, passwordOld, passwordNew, avatarFile]);

  useEffect(() => {
    const hasChanged =
      name !== user.name ||
      email !== user.email ||
      passwordOld ||
      passwordNew ||
      avatar !== originalAvatar;

    setIsChanged(hasChanged);
  }, [
    name,
    email,
    passwordOld,
    passwordNew,
    avatar,
    originalAvatar,
    user.name,
    user.email,
  ]);

  return (
    <Container>
      <header>
        <button type="button" onClick={handleBack}>
          <FiArrowLeft />
        </button>
        <button onClick={handleBack}>Voltar</button>
      </header>

      <Form>
        <Avatar>
          <img src={avatar} alt="Foto do usuário" />

          <label htmlFor="avatar">
            <FiCamera />

            <input id="avatar" type="file" onChange={handleChangeAvatar} />
          </label>
        </Avatar>

        <Input
          placeholder="Nome"
          type="text"
          icon={FiUser}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="E-mail"
          type="text"
          icon={FiMail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Senha atual"
          type="password"
          icon={FiLock}
          onChange={(e) => setPasswordOld(e.target.value)}
        />

        <Input
          placeholder="Nova senha"
          type="password"
          icon={FiLock}
          onChange={(e) => setPasswordNew(e.target.value)}
        />

        <Button
          title="Salvar"
          onClick={handleUpdate}
          className={isChanged ? "active" : "inactive"}
        />
      </Form>
    </Container>
  );
}
