function MainEmpty(): JSX.Element {
  return (
    <div className="catalog__cards" data-testid="main-empty">
      <h3 className="title title--h3">
        Техника такой категории/типа/уровня не найдена. Поменяйте фильтры.
      </h3>
    </div >
  );
}

export default MainEmpty;
