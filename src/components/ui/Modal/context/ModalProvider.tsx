import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ModalState {
  [key: string]: boolean;
}

interface ModalContextProps {
  modalState: ModalState;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  setModalData: (id: string, data: any) => void;
  getModalData: (id: string) => any;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);
/**
 * Universal Modal Provider that will allow to open and close modals from any component byt using the useModal hook and unique id.
 * @param children
 * @constructor
 */
export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalState, setModalState] = useState<ModalState>({});
  const [modalData, setModalDataState] = useState<{ [key: string]: any }>({});

  const openModal = (id: string) => {
    setModalState((prevState) => ({ ...prevState, [id]: true }));
  };

  const closeModal = (id: string) => {
    setModalState((prevState) => ({ ...prevState, [id]: false }));
  };

  const setModalData = (id: string, data: any) => {
    setModalDataState((prevState) => ({ ...prevState, [id]: data }));
  };

  const getModalData = (id: string) => {
    return modalData[id];
  };

  return (
    <ModalContext.Provider
      value={{ modalState, openModal, closeModal, setModalData, getModalData }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
