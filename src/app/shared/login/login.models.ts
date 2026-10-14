export class Usuario {
  public expiresIn: Date;

  constructor(
    public Nombre: string,
    public Persona: string,
    public Tipo: string,
    public Ures: string,
    public usuId: number,
    public Login: string,
    public token: string,
    public exp: number,
    public tipoDescrip:string,
    public uresDescrip:string
  ) {
    this.expiresIn = new Date(exp * 1000);
  }
}