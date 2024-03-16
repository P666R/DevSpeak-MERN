import { Button } from 'flowbite-react';

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources for more learnings!
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://javascript.info/"
            target="_blank"
            rel="noopener noreferrer"
          >
            JavaScript Info
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://www.internetacademy.co.in/_assets/img/what-you-can-do-with-javascript.jpg"
          alt="js"
        />
      </div>
    </div>
  );
}

export default CallToAction;
