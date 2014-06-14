import Letter = require("./../model/Letter")
import MailManager = require("./../manager/MailManager")
import NotificationManager = require("./../manager/NotificationManager")

var nm: NotificationManager = new NotificationManager();
nm.notifiyCustomersOfDispatchedDocuments();