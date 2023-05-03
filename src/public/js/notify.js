if (search) {
  const isNotify = search.split("&")[0].split("=")[0] == "notify_topic";

  if (isNotify) {
    const topic = search.split("&")[0].split("=")[1].replace(/%20/g, " ");
    const msg = search.split("&")[1].split("=")[1].replace(/%20/g, " ");
    const status = search.split("&")[2].split("=")[1].replace(/%20/g, " ");

    setTimeout(() => {
      alertNotification(topic, msg, status);
    }, 1000);
  }
}