const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const weeks = [];
    let currentWeek = [];

    daysInMonth.forEach((day, index) => {
      if (index % 7 === 0 && index > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    // Đảm bảo còn lại của currentWeek được thêm vào nếu có
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks.map((week, index) => renderWeek(week, index));
  };

export default renderCalendar